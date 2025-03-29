
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    navigate('/');
  }, [navigate]);

  return null; // No need to render anything since we redirect
};

export default Index;
