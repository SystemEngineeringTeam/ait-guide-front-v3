import { RouteEdgeOptionsKey } from '@/hooks/useRouteBuilder/types/route';
import styles from './index.module.scss';
import classNames from 'classnames';

interface Props {
  isEnabled: boolean;
  selected: boolean;
  optionKey: RouteEdgeOptionsKey;
  handleChange: (optionKey: RouteEdgeOptionsKey, value: boolean) => void;
}

export default function AutoReflectOption({ isEnabled, selected, optionKey, handleChange }: Props) {
  return (
    <div className={classNames(styles.item, styles.autoReflectOption)}>
      <input
        type="checkbox"
        id={`autoreflect-${optionKey}`}
        checked={selected}
        onChange={(e) => handleChange(optionKey, e.target.checked)}
        disabled={!isEnabled}
      />
      <label htmlFor={`autoreflect-${optionKey}`}>✨</label>
    </div>
  );
}
