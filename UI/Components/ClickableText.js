import { TouchableOpacity, Text } from "react-native";

export const ClickableText = ({ text, onPress, style }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={style}>{text}</Text>
  </TouchableOpacity>
);
