export interface Animal {
  name: string;
  gender: string;
  species: string;
  age: number;
  health: string;
  nature: string;
  photos?: string[]; // URLs
  isAdopted: boolean; // Availability: available: false | already adopted: true;
  post_ids?: string[];
}
