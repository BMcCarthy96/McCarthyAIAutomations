import {
  Globe,
  Phone,
  Calendar,
  MessageCircle,
  Workflow,
  Cpu,
  type LucideIcon,
} from "lucide-react";

const serviceIconMap: Record<string, LucideIcon> = {
  Globe,
  Phone,
  Calendar,
  MessageCircle,
  Workflow,
  Cpu,
};

export function getServiceIcon(iconName: string): LucideIcon {
  return serviceIconMap[iconName] ?? Globe;
}
