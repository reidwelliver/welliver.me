.PHONY: dev dev-up dev-down ui mqtt wasm build clean

# Start all dev services
dev: dev-up

dev-up:
	docker compose -f stack/docker-compose.dev.yml up -d

dev-down:
	docker compose -f stack/docker-compose.dev.yml down

# Individual services
ui:
	cd typescript/ui && npm run dev

mqtt:
	docker compose -f stack/components/mqtt/docker-compose.yml up -d

# Build WASM module
wasm:
	cd rust/wasm && wasm-pack build --target web --out-dir ../../typescript/ui/src/wasm-pkg

# Build frontend for production
build: wasm
	cd typescript/ui && npm run build

clean:
	rm -rf typescript/ui/dist typescript/ui/src/wasm-pkg rust/wasm/target
