export interface User {
  fullName: string;
  birthDate: string;
  email: string;
  createdAt: string;
  role: string;
  ageGroup: string;
  gender: string;
}
export interface Competition {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  entryFee: number;
  ageGroups: number[];
}
