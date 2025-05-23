import { UserPlus2 } from "lucide-react";

interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export const AddUserIcon = ({ size = 20, color = "#333", className = "" }: Props) => (
  <UserPlus2 size={size} color={color} className={className} />
)