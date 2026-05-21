import {
  Globe,
  Phone,
  Calendar,
  MessageCircle,
  Workflow,
  Cpu,
  Search,
  UserCheck,
  Zap,
  FileText,
  type LucideIcon,
} from "lucide-react";

const serviceIconMap: Record<string, LucideIcon> = {
  Globe,
  Phone,
  Calendar,
  MessageCircle,
  Workflow,
  Cpu,
  Search,
  UserCheck,
  Zap,
  FileText,
};

export function getServiceIcon(iconName: string): LucideIcon {
  return serviceIconMap[iconName] ?? Globe;
}
