import type React from "react";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

export interface HorizontalScrollPagerRef {
  setPageWithoutAnimation: (pageIndex: number) => void;
}

interface IHorizontalScrollPager {
  initialPage?: number;
  onPageChanged: (pageIndex: number) => void;
  style?: ViewStyle;
  children: React.ReactNode;
}

const HorizontalScrollPager = forwardRef<
  HorizontalScrollPagerRef,
  IHorizontalScrollPager
>(
  (
    { initialPage, onPageChanged, style, children }: IHorizontalScrollPager,
    ref,
  ) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const windowWidth = Dimensions.get("window").width;

    useImperativeHandle(ref, () => ({
      setPageWithoutAnimation: (pageIndex: number) => {
        scrollViewRef.current?.scrollTo({
          x: pageIndex * windowWidth,
          animated: false,
        });
        setCurrentPage(pageIndex);
      },
    }));

    // if initialPage is provided, scroll to that page
    useLayoutEffect(() => {
      if (!initialPage) return;
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          x: initialPage * windowWidth,
          animated: false,
        });
      });
    }, [initialPage, windowWidth]);

    const handleMomentumScrollEnd = (
      event: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const pageIndex = Math.round(offsetX / windowWidth);

      if (pageIndex !== currentPage) {
        setCurrentPage(pageIndex);
        onPageChanged(pageIndex);
      }
    };

    return (
      <View style={[styles.root, style]}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true },
          )}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToAlignment="center"
          decelerationRate="fast"
        >
          {children}
        </Animated.ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default HorizontalScrollPager;
