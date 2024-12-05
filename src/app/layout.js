"use client"
import React from 'react';
import Header from './component/Header';
import App from './main/App';
import Footer from './component/Footer';
import Test from './test/test';

const Layout = ({ children }) => {
  return (
    <html lang="ko">
      <body>
        <Header />
        <App />
        {/* <Test /> */}
        

        {children}
      </body>
     
    </html>
  );
};

export default Layout;
