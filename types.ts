
export type PlanType = 'Basic' | 'Pro' | 'Enterprise';

export interface UserProfile {
  name: string;
  email: string;
  niche: string;
  targetAudience: string;
  plan: PlanType;
  referralCode: string;
}

export interface VideoProject {
  id: string;
  title: string;
  status: 'Draft' | 'Generating' | 'Ready' | 'Published' | 'Error';
  thumbnailUrl: string;
  createdAt: string;
  views: number;
}

export interface AffiliateStats {
  totalReferrals: number;
  activeSubscriptions: number;
  totalEarnings: number;
  payoutHistory: { date: string; amount: number }[];
}

export interface ScriptOutput {
  title: string;
  hook: string;
  body: string;
  cta: string;
}
