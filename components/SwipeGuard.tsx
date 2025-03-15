import { type FC, useCallback, useRef } from "react";
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
} from "react-native";

export const SwipeGuard: FC<PressableProps> = ({ onPress, ...props }) => {
  const touchStartPositionRef = useRef<{
    pageX: number;
    pageY: number;
  } | null>(null);

  const handlePressIn = useCallback((e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;

    touchStartPositionRef.current = {
      pageX,
      pageY,
    };
  }, []);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent;

      // Calculate the distance moved from the initial touch position
      if (touchStartPositionRef.current) {
        const absX = Math.abs(touchStartPositionRef.current.pageX - pageX);
        const absY = Math.abs(touchStartPositionRef.current.pageY - pageY);

        // Check if the touch has been dragged more than a threshold (2 pixels)
        const isDragged = absX > 2 || absY > 2;
        if (!isDragged) {
          onPress?.(e);
        }
      }
    },
    [onPress],
  );

  return (
    <Pressable onPressIn={handlePressIn} onPress={handlePress} {...props}>
      {props.children}
    </Pressable>
  );
};
