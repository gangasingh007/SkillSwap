export interface User {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  skillTags: string[];
  avatarUrl?: string;
  reputationScore: number;
  isVerified: boolean;
  completenessScore: number;
  timezone: string;
  availabilityToggle: boolean;
  createdAt: Date;
}
