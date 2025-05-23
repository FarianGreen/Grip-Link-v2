import { ArrowLeft } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const ArrowBackIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <ArrowLeft size={size} color={color} className={className} />
);