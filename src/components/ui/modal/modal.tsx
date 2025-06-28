import React, { FC } from 'react';
import styles from './modal.module.css';

export type TModalUIProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const ModalUI: FC<TModalUIProps> = ({ title, onClose, children }) => (
  <div className={styles.modal}>
    <div className={styles.header}>
      <h2 className={`text text_type_main-large ${styles.title}`}>{title}</h2>
      <button className={styles.close} onClick={onClose}>
        ✖
      </button>
    </div>
    <div className={styles.content}>{children}</div>
  </div>
);
