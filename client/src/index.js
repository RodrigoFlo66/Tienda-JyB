import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App'
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={esES}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);