import { App } from '@client/App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

document.addEventListener('DOMContentLoaded', async () => {
  const appDiv = document.getElementById('app');
  if (appDiv) {
    createRoot(appDiv).render(
      <StrictMode>
        <App />
      </StrictMode>);
  }
});
