import { Separator } from "@/components/Separator";
import { useThemeColor } from "@/hooks/useThemeColor";
import { type Href, Link, Stack } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Animated, Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  const colors = useThemeColor();

  const data: {
    text: string;
    href: Href;
  }[] = [
    {
      text: "Image gallery modal and zoom",
      href: "/image-gallery-modal",
    },
    {
      text: "Circular carousel",
      href: "/circular-carousel",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Animations",
        }}
      />
      <Animated.FlatList
        data={data}
        scrollEventThrottle={16}
        ItemSeparatorComponent={() => (
          <View style={{ backgroundColor: colors.background }}>
            <Separator paddingHorizontal={20} />
          </View>
        )}
        renderItem={({ item }) => (
          <Link href={item.href} asChild>
            <Pressable
              style={{
                backgroundColor: colors.background,
                paddingHorizontal: 20,
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>
                {item.text}
              </Text>
              <ChevronRight size={25} color={colors.icon} />
            </Pressable>
          </Link>
        )}
        keyExtractor={(item, index) => `${item.text}-${index}`}
      />
    </>
  );
}
