import { SendHorizonal } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const SendIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <SendHorizonal size={size} color={color} className={className} />
);