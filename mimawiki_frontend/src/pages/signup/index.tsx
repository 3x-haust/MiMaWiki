import { useState } from 'react';

function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleGetCode = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      await response.json();
      alert('인증 코드가 발송되었습니다. 5분 이내에 입력해주세요.');
    } catch (error) {
      console.error(error);
      alert('인증 코드 발급에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname,
          email,
          password,
          code
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('회원가입 성공!');
      } else {
        alert(`회원가입 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nickname" 
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input 
          type="number" 
          placeholder="Code" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button 
          type="button" 
          onClick={handleGetCode}
        >
          Get Code
        </button>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;