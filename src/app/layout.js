"use client"
import React from 'react';
import Header from './component/Header';
import App from './main/App';
import Footer from './component/Footer';
import Map from './map/Map';


const Layout = ({ children }) => {
  return (
    <html lang="ko">
      <body>
        <Header />
        <App />
        <Map />
       
        <Footer />    

        {children}
      </body>
     
    </html>
  );
};

export default Layout;
