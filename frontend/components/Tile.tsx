import React, { useCallback, useMemo } from "react";
// @ts-ignore - TODO: install styled-components definitions
import styled, { keyframes } from "styled-components";
import { FrontendTile } from "@welliver.me/tile";
import customTilesById from "./CustomTiles";
import "@welliver.me/frontend/style/Tile.scss";

const animation = {
  from: {
    opacity: 0,
    transform: "scale3d(1.75, 1.75, 1.75) translate3d(0, 20px, 0)",
    animationTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1)",
  },
  "96%": {
    opacity: 1,
    transform: "scale3d(0.99, 0.99, 0.99) translate3d(0, 1px, 0)",
    animationTimingFunction: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  },
};

const bounceAnimation = keyframes`${animation}`;

/**
 * attempting to use forwardRef and directly calling Tile from the render method of ReactGridLayout
 * leads to unreliable dragging behavior. I think something in the library that forwards data-grid and the ref
 * causes this.
 */
export function makeTile(tile: TileProps) {
  return (
    <div key={tile.id}>
      <TileComponent {...tile} />
    </div>
  );
}

function TileComponent(props: TileProps) {
  const { id, onTileClick, animated, classes } = props;

  const CustomChildComponent = customTilesById[id];

  const AnimatedDiv = useMemo(
    () => styled.div`
      animation: 0.9s ${bounceAnimation};
      animation-delay: ${Math.floor(Math.random() * 10) * 0.15}s;
      animation-fill-mode: both;
    `,
    []
  );

  const onDoubleClick = useCallback(() => {
    if (onTileClick) onTileClick(id);
  }, []);

  if (animated) {
    return (
      <AnimatedDiv className={`tile ${classes}`} onDoubleClick={onDoubleClick}>
        {CustomChildComponent ? (
          <CustomChildComponent {...props} />
        ) : (
          <span className="text">{id}</span>
        )}
      </AnimatedDiv>
    );
  }

  return (
    <div className={`tile ${classes}`} onDoubleClick={onDoubleClick}>
      {CustomChildComponent ? (
        <CustomChildComponent {...props} />
      ) : (
        <span className="text">{id}</span>
      )}
    </div>
  );
}

interface TileProps extends FrontendTile {
  onTileClick?: (key: string) => void;
}
