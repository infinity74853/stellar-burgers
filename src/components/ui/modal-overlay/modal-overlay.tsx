import React, { FC } from 'react';
import styles from './modal-overlay.module.css';

export type TModalOverlayProps = {
  onClick: () => void;
};

export const ModalOverlayUI: FC<TModalOverlayProps> = ({ onClick }) => (
  <div className={styles.overlay} onClick={onClick} />
);
