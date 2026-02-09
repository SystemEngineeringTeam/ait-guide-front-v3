import styles from './index.module.scss';
import { InfoIcon } from '@/components/Icons';
import classNames from 'classnames';
import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
}

export const infoToast = (message: string, options?: ToastOptions) =>
  toast(message, {
    duration: options?.duration ?? 4000,
    position: 'top-center',
    icon: <InfoIcon className={classNames(styles.popIn, styles.blue)} />,
  });

export const errorToast = (message: string, options?: ToastOptions) =>
  toast.error(message, {
    duration: options?.duration ?? 4000,
    position: 'top-center',
  });
