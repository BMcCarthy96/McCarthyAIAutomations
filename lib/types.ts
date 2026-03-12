export interface Service {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  icon: string;
  highlights?: string[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface DashboardService {
  id: string;
  name: string;
  status: "active" | "in_progress" | "pending";
  statusLabel: string;
  progress: number;
  nextMilestone: string;
  nextMilestoneDate: string;
  recentUpdate: string;
  recentUpdateDate: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}
