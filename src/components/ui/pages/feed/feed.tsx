import { FC, memo } from 'react';
import styles from './feed.module.css';
import { OrdersList, FeedInfo } from '@components'; // Импортируем обновленный FeedInfo
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import { TOrder } from '@utils-types';

export type FeedUIProps = {
  orders: TOrder[];
  handleGetFeeds: () => void;
  total: number;
  today: number;
};

export const FeedUI: FC<FeedUIProps> = memo(
  ({ orders, handleGetFeeds, total, today }) => (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <RefreshButton
          text='Обновить'
          onClick={handleGetFeeds}
          extraClass={'ml-30'}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} />
        </div>
        <div className={styles.columnInfo}>
          {/* Передаем данные в обновленный FeedInfo */}
          <FeedInfo orders={orders} total={total} today={today} />
        </div>
      </div>
    </main>
  )
);
