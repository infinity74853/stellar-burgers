import { FC } from 'react';
import { useSelector } from '../../../../services/store';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = () => {
  const { orderHistory } = useSelector((state) => state.orderHistory);

  return (
    <main className={`${styles.main}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <div className={`mt-10 ${styles.orders}`}>
        <OrdersList orders={orderHistory} />
      </div>
    </main>
  );
};
