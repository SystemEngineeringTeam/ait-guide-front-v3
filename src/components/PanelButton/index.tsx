import styles from './index.module.scss';
import { ComponentProps } from 'react';
import classNames from 'classnames';

interface Props extends ComponentProps<'button'> {
  emoji?: string;
  selected?: boolean;
}

export default function PanelButton({ children, emoji, selected, className, ...rest }: Props) {
  return (
    <button className={classNames(styles.button, className)} {...rest} data-selected={selected}>
      {emoji && <span>{emoji}</span>}
      <span>{children}</span>
    </button>
  );
}
