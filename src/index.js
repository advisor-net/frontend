/* eslint-disable react/jsx-filename-extension */
import { createRoot } from 'react-dom/client';
import App from './App';
import 'rc-pagination/assets/index.css';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
