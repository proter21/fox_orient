export interface User {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  createdAt: string;
  role: string;
  ageGroup: string;
  gender: string;
}

export interface CompetitionResult {
  time: string;
  place?: number;
  updatedAt: string;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  entryFee: number;
  ageGroups: string[];
  participants: string[];
  results?: {
    [userId: string]: CompetitionResult;
  };
}
