import styles from './index.module.scss';
import classNames from 'classnames';

interface Props {
  className?: string;
}

export default function Spinner({ className }: Props) {
  return <div className={classNames(styles.spinner, className)}></div>;
}
