import { useState, useEffect, useMemo } from 'react';
import { styled } from "styled-components";
import { theme } from "../../../app/styles";
import { useAuthStore } from '../hooks';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: 2px solid ${theme.primary};
  }
`;

const Button = styled.button<{ $disabled?: boolean }>`
  padding: 0.8rem;
  background-color: ${props => props.$disabled ? '#ccc' : theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ErrorModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  text-align: center;
`;

const ValidationMessage = styled.small<{ $valid: boolean }>`
  color: ${props => props.$valid ? theme.primary : 'red'};
  margin-top: -0.5rem;
  text-align: left;
`;

const Timer = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.primary};
`;

export const AuthModal = ({ isOpen, onClose }: { 
  isOpen: boolean; 
  onClose: () => void 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    code: ''
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [fieldValidity, setFieldValidity] = useState({
    email: false,
    nickname: false,
    password: false,
    code: false
  });

  const { login } = useAuthStore();

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', nickname: '', password: '', code: '' });
      setTimeLeft(0);
      setIsSignUp(false);
      setError('');
      setFieldValidity({
        email: false,
        nickname: false,
        password: false,
        code: false
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const isFormValid = useMemo(() => {
    return {
      email: isSignUp 
        ? formData.email.trim() !== '' && isValidEmail(formData.email) 
        : true,
      nickname: !!formData.nickname.trim(),
      password: isSignUp ? formData.password.trim().length >= 8 : !!formData.password.trim(),
      code: isSignUp ? !!formData.code.trim() : true
    };
  }, [formData, isSignUp]);

  useEffect(() => {
    setFieldValidity(isFormValid);
  }, [isFormValid]);

  const showError = (message: string) => {
    setError(message);
    setShowErrorModal(true);
    setTimeout(() => setShowErrorModal(false), 2000);
  };

  const handleSendCode = async () => {
    if (!formData.email.trim()) {
      showError('이메일을 입력해주세요');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:3000/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (!response.ok) throw new Error('인증코드 전송 실패');
      setTimeLeft(300);
    } catch (err) {
      showError(err instanceof Error ? err.message : '요청 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(isFormValid).every(Boolean)) {
      showError('모든 필드를 올바르게 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      const body = isSignUp ? formData : {
        nickname: formData.nickname,
        password: formData.password
      };

      const response = await fetch(`http://127.0.0.1:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message);
      
      if (isSignUp) {
        showError('회원가입 성공! 로그인해주세요');
        setIsSignUp(false);
      } else {
        login(formData.nickname, responseData.data);
        onClose();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : '처리 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
      <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>{isSignUp ? '회원가입' : '로그인'}</h2>

        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ borderColor: fieldValidity.email ? '#ddd' : 'red' }}
              />
              <ValidationMessage $valid={fieldValidity.email}>
                {formData.email.trim() === '' 
                  ? '이메일을 입력해주세요'
                  : (fieldValidity.email 
                    ? '' 
                    : '유효한 이메일을 입력해주세요')}
              </ValidationMessage>
            </>
          )}

          <Input
            type="text"
            placeholder="닉네임"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            style={{ borderColor: fieldValidity.nickname ? '#ddd' : 'red' }}
          />
          <ValidationMessage $valid={fieldValidity.nickname}>
            {fieldValidity.nickname ? '' : '닉네임을 입력해주세요'}
          </ValidationMessage>

          <Input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ borderColor: fieldValidity.password ? '#ddd' : 'red' }}
          />
          <ValidationMessage $valid={fieldValidity.password}>
          {formData.password.trim() === '' 
                  ? '비밀번호를 입력해주세요'
                  : (fieldValidity.password 
                    ? '' 
                    : '8자리 이상의 비밀번호를 입력해주세요')}
          </ValidationMessage>

          {isSignUp && (
            <>
              <div style={{ position: 'relative' }}>
                <Input
                  type="number"
                  placeholder="인증코드"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  style={{ borderColor: fieldValidity.code ? '#ddd' : 'red', paddingRight: '70px' }}
                />
                {timeLeft > 0 && (
                  <Timer>
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </Timer>
                )}
              </div>
              <ValidationMessage $valid={fieldValidity.code}>
                {fieldValidity.code ? '' : '인증코드를 입력해주세요'}
              </ValidationMessage>

              <Button
                type="button"
                onClick={handleSendCode}
                $disabled={timeLeft > 0 || loading}
              >
                {timeLeft > 0 ? '인증코드 재전송' : '인증코드 전송'}
              </Button>
            </>
          )}

          <Button 
            type="submit" 
            $disabled={!Object.values(isFormValid).every(Boolean) || loading}
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </Button>
        </Form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          {isSignUp ? (
            <Button 
              type="button" 
              onClick={() => setIsSignUp(false)}
              $disabled={loading}
              style={{ background: 'none', color: theme.primary }}
            >
              이미 계정이 있으신가요? 로그인
            </Button>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Button 
                type="button" 
                onClick={() => setIsSignUp(true)}
                $disabled={loading}
                style={{ background: 'none', color: theme.primary }}
              >
                회원가입
              </Button>
              <Button 
                type="button" 
                onClick={() => showError('서비스 준비 중입니다')}
                style={{ background: 'none', color: theme.primary }}
              >
                닉네임 찾기
              </Button>
              <Button 
                type="button" 
                onClick={() => showError('서비스 준비 중입니다')}
                style={{ background: 'none', color: theme.primary }}
              >
                비밀번호 찾기
              </Button>
            </div>
          )}
        </div>

        {showErrorModal && (
          <ErrorModal>
            <p style={{ color: 'red' }}>{error}</p>
            <Button 
              onClick={() => setShowErrorModal(false)}
              style={{ marginTop: '1rem' }}
            >
              확인
            </Button>
          </ErrorModal>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};