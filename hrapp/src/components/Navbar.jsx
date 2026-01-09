import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">{t('app.title')}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex space-x-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded ${
                i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className={`px-3 py-1 rounded ${
                i18n.language === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className={`px-3 py-1 rounded ${
                i18n.language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              AR
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
