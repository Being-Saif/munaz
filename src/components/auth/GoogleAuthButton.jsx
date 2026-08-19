import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '@redux/slices/authSlice';
import toast from 'react-hot-toast';
import api from '@services/api';

const GoogleAuthButton = ({ mode = 'login' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      if (res.success && res.user) {
        dispatch(setCredentials({ user: res.user, accessToken: res.token }));
        localStorage.setItem('munaz_token', res.token);
        toast.success(`Welcome${res.user.name ? ', ' + res.user.name.split(' ')[0] : ''}!`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error('Google login failed')}
        theme="outline"
        size="large"
        width="100%"
        text={mode === 'signup' ? 'signup_with' : 'signin_with'}
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleAuthButton;
