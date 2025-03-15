import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "react-native";

type Props = {
  text?: string;
  paddingHorizontal?: 20;
};

export const Separator: React.FC<Props> = ({ text, paddingHorizontal }) => {
  const color = useThemeColor();
  if (text) {
    return (
      <View
        style={{
          paddingHorizontal,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, backgroundColor: color.border, height: 1 }} />
        <Text style={{ color: color.text, paddingHorizontal: 10 }}>{text}</Text>
        <View style={{ flex: 1, backgroundColor: color.border, height: 1 }} />
      </View>
    );
  }
  return (
    <View style={{ paddingHorizontal }}>
      <View
        style={{
          height: 1,
          backgroundColor: color.border,
        }}
      />
    </View>
  );
};
