import { Pencil } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const EditIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <Pencil size={size} color={color} className={className} />
);