import { useWindowDimensions } from "react-native";

export default function useDimensions() {
  const { height, width } = useWindowDimensions();

  const hp = (percentage: number) => height * (percentage / 100);
  const wp = (percentage: number) => width * (percentage / 100);

  return { height, width, hp, wp };
}
