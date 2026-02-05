import styles from './index.module.scss';
import classNames from 'classnames';

interface Props extends React.ComponentPropsWithRef<'input'> {}

export default function Input({ children, className, ...props }: Props) {
  return <input className={classNames(styles.input, className)} {...props} />;
}
