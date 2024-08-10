import { Button, View } from "react-native";

export default function Controls({ onSearch }: ControlsProps) {
  return (
    <View>
      <Button title="Search!" onPress={onSearch} />
    </View>
  );
}

export interface ControlsProps {
  onSearch: () => any;
}
