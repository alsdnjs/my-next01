import React from 'react';
import Header from './component/Header';
import App from './main/App';

const Layout = ({ children }) => {
  return (
    <html lang="ko">
      <body>
        <Header />
        <App />
        {children}
      </body>
    </html>
  );
};

export default Layout;
