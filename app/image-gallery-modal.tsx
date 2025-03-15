import HorizontalScrollPager, {
  type HorizontalScrollPagerRef,
} from "@/components/HorizontalScrollPager";
import { SwipeGuard } from "@/components/SwipeGuard";
import data from "@/data/images.json";
import { useModal } from "@/hooks/useModal";
import { ImageZoom, ZOOM_TYPE } from "@likashefqet/react-native-image-zoom";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function ImageGalleryModalZoomScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = windowWidth;
  const imageHeight = windowWidth * (4 / 3);
  const { isOpen, close, toggle } = useModal();

  const images = data.images.map((image) => image.url);

  // the index of the currently displayed image
  const horizontalScrollPagerRef = useRef<HorizontalScrollPagerRef>(null);
  // the index of the currently displayed image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const onChangePage = useCallback((index: number) => {
    horizontalScrollPagerRef.current?.setPageWithoutAnimation(index);
    setCurrentImageIndex(index);
  }, []);

  return (
    <>
      <View style={{ height: imageHeight }}>
        <HorizontalScrollPager
          ref={horizontalScrollPagerRef}
          onPageChanged={(index) => {
            if (index !== currentImageIndex) {
              setCurrentImageIndex(index);
            }
          }}
        >
          {images.map((image, index) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              key={index.toString()}
            >
              <SwipeGuard
                onPress={() => {
                  toggle();
                }}
              >
                <Image
                  style={{
                    height: imageHeight,
                    width: imageWidth,
                  }}
                  source={image}
                  contentFit="cover"
                  transition={100}
                />
              </SwipeGuard>
            </View>
          ))}
        </HorizontalScrollPager>
        <BlurView
          intensity={100}
          tint="dark"
          style={{
            position: "absolute",
            right: 15,
            bottom: 15,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 50,
            overflow: "hidden",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {currentImageIndex + 1}/{images.length}
          </Text>
        </BlurView>
      </View>

      {isOpen && (
        <ImageGalleryModal
          images={images}
          isOpen={isOpen}
          currentImageIndex={currentImageIndex}
          onChangePage={onChangePage}
          onClose={close}
        />
      )}
    </>
  );
}

// Modal for image gallery with zoom
type Props = {
  isOpen: boolean;
  images: string[];
  onClose: () => void;
  currentImageIndex: number;
  onChangePage: (index: number) => void;
};
const DURATION = 150;

export const ImageGalleryModal = ({
  images,
  onClose,
  isOpen,
  currentImageIndex,
  onChangePage,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = windowWidth;
  const imageHeight = windowWidth * (4 / 3);
  const [zooming, setZooming] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(true);

  return (
    <Modal
      visible={isOpen}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView>
        <View style={styles.container}>
          {isInfoVisible && (
            <Animated.View
              entering={FadeIn.duration(DURATION)}
              exiting={FadeOut.duration(DURATION)}
              style={styles.headerStyle}
            >
              <Pressable
                onPress={onClose}
                hitSlop={15}
                style={styles.headerLeft}
              >
                <X size={28} color="#fff" strokeWidth={2.5} />
              </Pressable>
              <Text style={styles.headerTitleStyle}>拡大・縮小</Text>
            </Animated.View>
          )}

          <HorizontalScrollPager
            initialPage={currentImageIndex}
            onPageChanged={(index) => {
              if (index !== currentImageIndex) {
                onChangePage(index);
              }
            }}
          >
            {images.map((image, index) => (
              <View key={index.toString()} style={styles.imageContainer}>
                <View style={[styles.imageWrapper, { height: imageHeight }]}>
                  <ImageZoom
                    uri={image}
                    style={{ height: imageHeight, width: imageWidth }}
                    isDoubleTapEnabled
                    isSingleTapEnabled
                    // minPanPointers={1}
                    isPanEnabled={zooming}
                    onPinchEnd={(e) => {
                      setZooming(e.scale > 1);
                    }}
                    onDoubleTap={(zoomType) => {
                      setZooming(zoomType === ZOOM_TYPE.ZOOM_IN);
                    }}
                    onSingleTap={() => {
                      setIsInfoVisible((visible) => !visible);
                    }}
                  />
                </View>
              </View>
            ))}
          </HorizontalScrollPager>

          {isInfoVisible && (
            <Animated.View
              entering={FadeIn.duration(DURATION)}
              exiting={FadeOut.duration(DURATION)}
            >
              <BlurView intensity={100} tint="dark" style={styles.blurView}>
                <Text style={styles.pageIndicator}>
                  {currentImageIndex + 1}/{images.length}
                </Text>
              </BlurView>
            </Animated.View>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  headerStyle: {
    position: "absolute",
    padding: 20,
    flexDirection: "row",
    zIndex: 1,
    alignItems: "center",
    backgroundColor: "#000",
    width: "100%",
    justifyContent: "center",
  },
  headerTitleStyle: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  headerLeft: {
    position: "absolute",
    left: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    flex: 1,
  },
  blurView: {
    position: "absolute",
    alignSelf: "center",
    bottom: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    overflow: "hidden",
  },
  pageIndicator: {
    color: "#fff",
    fontSize: 12,
  },
});
