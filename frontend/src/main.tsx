import { createRoot } from 'react-dom/client';
import { AppProviders } from './components/app/AppProviders/AppProviders';
import './index.css';
import App from './App.tsx';
import { getRequiredElement } from './utils/dom';

createRoot(getRequiredElement('root')).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
