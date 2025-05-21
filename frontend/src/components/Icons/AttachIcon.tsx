import { Paperclip } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const AttachIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <Paperclip size={size} color={color} className={className} />
);