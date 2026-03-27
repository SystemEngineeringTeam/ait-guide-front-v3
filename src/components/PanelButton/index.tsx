import styles from './index.module.scss';
import { ComponentProps } from 'react';
import classNames from 'classnames';

interface Props extends ComponentProps<'button'> {
  emoji?: string;
  selected?: boolean;
  danger?: boolean;
}

export default function PanelButton({ children, emoji, selected, danger, className, ...rest }: Props) {
  return (
    <button className={classNames(styles.button, className)} {...rest} data-selected={selected} data-danger={danger}>
      {emoji && <span>{emoji}</span>}
      <span>{children}</span>
    </button>
  );
}
