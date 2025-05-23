import { LogOut } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const LogoutIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <LogOut size={size} color={color} className={className} />
);