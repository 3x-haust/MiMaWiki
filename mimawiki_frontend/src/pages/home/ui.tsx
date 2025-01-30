import { Helmet } from 'react-helmet';
import { useAuthStore } from '../../features/auth';

export const HomePage = () => {
  const { isLoggedIn, user } = useAuthStore();

  if (isLoggedIn) {
    return (
      <div>
        <h2>Welcome, {user?.nickname}!</h2>
        <button onClick={() => useAuthStore.getState().logout()}>Logout</button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>홈페이지</title>
      </Helmet>

      <div> 
        <h1>Home Page</h1>
      </div>
    </>
  );
}