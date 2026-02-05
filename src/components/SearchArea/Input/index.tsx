import { ClearIcon } from '@/components/Icons';
import styles from './index.module.scss';
import classNames from 'classnames';

interface Props extends React.ComponentPropsWithRef<'input'> {
  clearable?: boolean;
  onClear?: () => void;
}

export default function Input({ children, className, clearable, onClear, ...props }: Props) {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <input className={styles.input} {...props} />
      {clearable && <ClearIcon className={styles.clearIcon} onClick={onClear} />}
    </div>
  );
}
