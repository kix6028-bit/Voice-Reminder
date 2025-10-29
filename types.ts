
export interface Task {
  id: string;
  text: string;
  time: Date;
  totalRepeats: number;
  repeatsLeft: number;
  repeatInterval: number; // in seconds
}
