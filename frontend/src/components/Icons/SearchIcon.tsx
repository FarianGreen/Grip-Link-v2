import { Search } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const SearchIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <Search size={size} color={color} className={className} />
);