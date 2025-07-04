import React, { FC } from 'react';
import styles from './profile-menu.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { ProfileMenuUIProps } from './type';

export const ProfileMenuUI: FC<ProfileMenuUIProps> = ({
  pathname,
  handleLogout
}) => {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <NavLink
        to={'/account/profile'}
        className={({ isActive }) =>
          `text text_type_main-medium text_color_inactive pt-4 pb-4 ${styles.link} ${
            isActive ? styles.link_active : ''
          }`
        }
        end
      >
        Профиль
      </NavLink>
      <NavLink
        to={'/account/order-history'}
        className={({ isActive }) =>
          `text text_type_main-medium text_color_inactive pt-4 pb-4 ${styles.link} ${
            isActive ? styles.link_active : ''
          }`
        }
      >
        История заказов
      </NavLink>
      <button
        className={`text text_type_main-medium text_color_inactive pt-4 pb-4 ${styles.button}`}
        onClick={onLogout}
      >
        Выход
      </button>
      <p className='pt-20 text text_type_main-default text_color_inactive'>
        {pathname === '/account/profile'
          ? 'В этом разделе вы можете изменить свои персональные данные'
          : 'В этом разделе вы можете просмотреть свою историю заказов'}
      </p>
    </>
  );
};
