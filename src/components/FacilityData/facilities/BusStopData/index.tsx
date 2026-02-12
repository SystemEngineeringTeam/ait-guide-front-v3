import styles from './index.module.scss';

export default function BusStopData() {
  return (
    <div className={styles.busStop}>
      <h2>バス案内(外部サイト) - 梶研究室</h2>
      <a href="https://bus.kajilab.net/" target="_blank" rel="noopener noreferrer">愛工大バス時刻表＜非公式＞</a>
      <iframe src="https://bus.kajilab.net/" title="愛工大バス時刻表＜非公式＞"></iframe>
    </div>
  );
}
