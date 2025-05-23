import { Trash2 } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const DeleteIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <Trash2 size={size} color={color} className={className} />
);