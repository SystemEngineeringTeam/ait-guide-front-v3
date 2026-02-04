import type { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ children, className, type, ...props }: Props) {
  return (
    <button type={type} className={classNames(styles.button, className)} {...props}>
      {children}
    </button>
  );
}
