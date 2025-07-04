import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const isProfileActive = location.pathname.startsWith('/account');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link to='/' className={`${styles.link} pt-4 pb-4 pl-5 pr-5`}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${isConstructorActive ? '' : 'text_color_inactive'}`}
            >
              Конструктор
            </p>
          </Link>
          <Link to='/feed' className={`${styles.link} pt-4 pb-4 pl-5 pr-5`}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${isFeedActive ? '' : 'text_color_inactive'}`}
            >
              Лента заказов
            </p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <Link
          to='/account'
          className={`${styles.link} ${styles.link_position_last} pt-4 pb-4 pl-5 pr-5`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p
            className={`text text_type_main-default ml-2 ${isProfileActive ? '' : 'text_color_inactive'}`}
          >
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};
