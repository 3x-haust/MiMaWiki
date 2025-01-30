export interface AuthResponse {
  data?: string | {
    id: string;
    email: string;
    nickname: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }
  error?: string;
  status: number;
  timeStamp: string;
  message: string;
}