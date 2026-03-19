## Summary
I am rewriting my personal website from scratch. I will be hosting it on azure free tier services with a few self-hosted components.

## Goal
The goal of the site is to digitally simulate experience of the packs of small refrigerator word magnets (white magnets with a single black word) that are used to create poems by moving them together into unique combinations.

## Repo layout
this will be monorepo containing the frontend and backend code
the repo should have the following folders:
- typescript
   - ui
- rust
   - wasm
- stack
   - docker-compose.dev.yml
   - docker-compose.yml
   - components
       - ui
         - docker-compose.yml
       - mqtt
         - docker-compose.yml

## Frontend Requirements
- Use typescript and React for creating the UI, starting with modern a best practice project including HMR/bundling
- the site should simulate the look-and-feel of the magnets
- as a user drags a single word magnet at a time around, every other user on the site sees the movement
- The new position is persisted
- The magnet should not be able to overlap
- We should probably base the drag and drop grid on some kind of static size and scale it with screen size, optimizing for 1920x1080
- Do not worry about optimizing for mobile right now, we will create a mobile fallback of this experience later
- each magnet will have the following attributes
  - title: string (word shown on magnet)
  - uuid: string
  - href: string
  - start_pos: {x: int, y: int}
  - width: int (grid width of the tile)
  - height: int (grid height of the tile)
- I want to experiment with Rust webassembly, so the magnet state store will be a binding to a webassembly worker which handles updates and syncronizes state to the backend.
- magnet data and magnet position will in separate frontend stores, since magnet position may change a lot and magnet data will not. We can relate by the magnet uuid
- use the dnd-kit library for drag and drop
- when a user picks a magnet up, the UI should send an MQTT message to a topic of `magnets/<magnet_UID>/owner` with a payload of the MQTT clientId, durable but with a TTL of 1 minute
- when a user moves a magnet, the UI should send an MQTT message to a topic `magnets/<magnet_UID>/position` with a payload of the grid coordinates such as {x: 10, y: 10}. This should be UI rate limited to 100ms minimum between updates. These messages should be durable with no TTL so that when a new client connects it gets the last known position
- when a user drops a magnet, `magnets/<magnet_UID>/owner` should be set to null and a final broadcast should be made to `magnets/<magnet_UID>/position` of the last updated position, also durable with no TTL
- magnet position will default to the statically fetched start_pos if it doesn't exist on MQTT

## Backend
The backend will consist of a few parts:
- an Azure static web app which is connected to this repo via a github CI action which triggers it to deploy
- the initial magnet config will come from a static JSON file deployed alongside the app
- an mqtt broker container (off-cloud hosted)
- the MQTT broker container should be configured so that the UI 

## DevX
- a makefile should launch docker containers for the react frontend and mqtt broker

## Deployment
- the repo should include a github action for deploying to the static webapp
