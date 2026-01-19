export interface UserData {
  name: string;
  balance: number;
  assets: Record<string, number> | null;
  day: number;
}
