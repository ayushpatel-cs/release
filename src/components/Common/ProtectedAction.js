import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useProtectedAction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const protectedAction = (action) => {
    if (!user) {
      navigate('/login');
      return false;
    }
    return action();
  };

  return protectedAction;
}; 