/* eslint-disable react/jsx-filename-extension */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'rc-pagination/assets/index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
