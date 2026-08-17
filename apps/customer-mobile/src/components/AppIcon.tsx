import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface AppIconProps {
  color?: string;
  name: IconName;
  size?: number;
}

export function AppIcon({
  color = "#A7B2C5",
  name,
  size = 20
}: AppIconProps) {
  return <Ionicons color={color} name={name} size={size} />;
}