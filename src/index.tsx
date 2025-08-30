import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Get the current domain for Auth0 redirect
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || "dev-bvu4qxnb3kxijdfg.us.auth0.com"}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || "LHDNebXVt5izd5oC61935KbKD9uXNYI2"}
      authorizationParams={{
        redirect_uri: getRedirectUri(),
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

