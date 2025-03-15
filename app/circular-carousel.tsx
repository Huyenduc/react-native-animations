import data from "@/data/images.json";
import { Image } from "expo-image";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  type FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  clamp,
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type CarouseItemProps = {
  image: string;
  index: number;
  scrollX: SharedValue<number>;
  onChangeIndex: (index: number) => void;
};

const { width } = Dimensions.get("screen");
const _itemSize = width * 0.22;
const _spacing = 16;
const _itemToSize = _itemSize + _spacing;

export default function CircularCarouselScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(() => data.images.map((image) => image.url), []);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = clamp(
        event.contentOffset.x / _itemToSize,
        0,
        images.length - 1,
      );

      const newActiveIndex = Math.round(scrollX.value);
      if (newActiveIndex !== activeIndex) {
        runOnJS(setActiveIndex)(newActiveIndex);
      }
    },
  });

  const onChangeIndex = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: 0,
      viewPosition: 0.5,
    });
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#000" }}
    >
      <Animated.Image
        key={`image-${activeIndex}`}
        source={{ uri: images[activeIndex] }}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={{ ...StyleSheet.absoluteFillObject }}
      />
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        style={{ flexGrow: 0, height: _itemSize * 2 }}
        contentContainerStyle={{
          paddingHorizontal: (width - _itemSize) / 2,
          gap: _spacing,
        }}
        keyExtractor={(item, index) => item + index}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <CarouseItem
              image={item}
              index={index}
              scrollX={scrollX}
              onChangeIndex={onChangeIndex}
            />
          );
        }}
        // paging animation
        snapToInterval={_itemToSize}
        decelerationRate="fast"
        // onScroll
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const CarouseItem = ({
  image,
  index,
  scrollX,
  onChangeIndex,
}: CarouseItemProps) => {
  const styleZ = useAnimatedStyle(() => {
    return {
      borderWidth: 4,
      borderColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        ["transparent", "#fff", "transparent"],
      ),
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [_itemSize / 3, 0, _itemSize / 3],
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styleZ,
        {
          width: _itemSize,
          height: _itemSize,
          borderRadius: 50,
        },
      ]}
    >
      <Pressable style={{ flex: 1 }} onPress={() => onChangeIndex(index)}>
        <Image source={{ uri: image }} style={{ flex: 1, borderRadius: 50 }} />
      </Pressable>
    </Animated.View>
  );
};
