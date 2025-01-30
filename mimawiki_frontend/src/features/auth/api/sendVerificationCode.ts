import { BASE_URL } from ".";

export const sendVerificationCode = async (email: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '인증코드 전송 실패');
  }
};