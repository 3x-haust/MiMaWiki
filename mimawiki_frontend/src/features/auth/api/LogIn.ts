import { AuthResponse, BASE_URL } from ".";

export const logIn = async (
  nickname: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password }),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || '로그인 실패');
  }

  return responseData;
};