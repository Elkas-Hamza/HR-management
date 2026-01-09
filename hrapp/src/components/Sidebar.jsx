import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();

  const menuItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
    { path: '/employees', label: t('nav.employees'), icon: '👥' },
    { path: '/departments', label: t('nav.departments'), icon: '🏢' },
    { path: '/salaries', label: t('nav.salaries'), icon: '💰' },
    { path: '/attendance', label: t('nav.attendance'), icon: '📅' },
    { path: '/leaves', label: t('nav.leaves'), icon: '🏖️' }
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
