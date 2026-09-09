import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '#/app';

const container = document.querySelector('#root');

if (container === null) {
  throw new Error('index.html is missing its #root container.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
