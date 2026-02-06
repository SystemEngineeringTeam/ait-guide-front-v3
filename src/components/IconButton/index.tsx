import styles from './index.module.scss';
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import classNames from 'classnames';

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon: ReactNode;
  hideText?: boolean;
  as?: React.ElementType;
}

export default function IconButton<T extends React.ComponentProps<any>>({
  icon,
  children,
  hideText,
  className,
  as: Component = 'button',
  ...rest
}: Props & T) {
  return (
    <Component type="button" className={classNames(styles.iconButton, className)} {...rest}>
      {icon}
      <span className={styles.text}>{children}</span>
    </Component>
  );
}
