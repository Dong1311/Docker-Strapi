"use client"

import './globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useTranslation } from 'react-i18next';
import localFont from 'next/font/local';
import  "bootstrap/dist/css/bootstrap.min.css";
import { AppProvider } from './AppContext'; 
import '../i18n'
import Navbar from '../components/NavBar';
// Sử dụng localFont để tải font cục bộ
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation(); 

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); 
  };



  return (
    <AppProvider>
      <html>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Navbar /> 
          <div className="language-switcher">
            <button onClick={() => changeLanguage('en')} className="btn btn-info ms-4 me-4">English</button>
            <button onClick={() => changeLanguage('vi')} className="btn btn-info">Tiếng Việt</button>
          </div>
  
          <main>
            {children}
          </main>
        </body>
      </html>
    </AppProvider>
  );
}
