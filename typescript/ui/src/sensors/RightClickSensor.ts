import { PointerSensor } from "@dnd-kit/core";
import type { PointerEvent } from "react";

/**
 * Custom dnd-kit sensor that only activates on right-click (button === 2).
 * Left-click is reserved for link navigation.
 */
export class RightClickSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: PointerEvent) => {
        return nativeEvent.button === 2;
      },
    },
  ];
}
