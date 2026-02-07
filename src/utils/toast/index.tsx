import styles from './index.module.scss';
import { InfoIcon } from '@/components/Icons';
import classNames from 'classnames';
import toast from 'react-hot-toast';

export const infoToast = (message: string) =>
  toast(message, {
    duration: 4000,
    position: 'top-center',
    icon: <InfoIcon className={classNames(styles.popIn, styles.blue)} />,
  });

export const errorToast = (message: string) =>
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
  });
