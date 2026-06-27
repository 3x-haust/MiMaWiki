import { MIMAWIKI_API_BASE_URL } from '../../../shared/api/baseUrl';

export const BASE_URL = MIMAWIKI_API_BASE_URL;
export type { AuthResponse } from './AuthResponse';
export { logIn } from './LogIn';
export { sendVerificationCode } from './sendVerificationCode';
export { signUp } from './SignUp';
