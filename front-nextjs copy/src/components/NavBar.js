// components/Navbar.tsx
"use client";

import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">MyApp</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">About</a>
            </li>
          </ul>
          <div className="d-flex">
            <button onClick={() => changeLanguage('en')} className="btn btn-info ms-4 me-4">English</button>
            <button onClick={() => changeLanguage('vi')} className="btn btn-info">Tiếng Việt</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
