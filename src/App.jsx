import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store, { persistor } from '@redux/store';
import router from './router';

const GOOGLE_CLIENT_ID = '507168833185-qtplfrs4hen02qe0g5p6hskkueqko8kk.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#1E1B4B',
                borderRadius: '12px',
                border: '1px solid #F3E8FF',
                boxShadow: '0 12px 32px rgba(126, 87, 194, 0.12)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
              },
            }}
          />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
