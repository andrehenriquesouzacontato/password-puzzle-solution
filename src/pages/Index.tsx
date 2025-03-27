
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecionando para página de login...');
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null; // No need to render anything since we redirect
};

export default Index;
