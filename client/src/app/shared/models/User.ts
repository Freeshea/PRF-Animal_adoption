export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  favourite_animals?: string[];
  adoption_requests?: string[];
}
