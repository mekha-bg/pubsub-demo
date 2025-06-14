import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { Amplify } from 'aws-amplify';
import { awsConfig } from './aws-config';
import './utils/pubsub'; 

Amplify.configure(awsConfig);
//Auth.configure(awsConfig.Auth);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
