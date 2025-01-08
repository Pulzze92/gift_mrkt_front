import styles from './style.module.scss';
import TopMenu from '../components/TopMenu';
import TopContextMenu from '../components/TopContextMenu';
import BottomMenu from '../components/BottomMenu';

function SellPage() {
  return (
    <div className={styles.sellPageContainer}>
      <TopMenu />
      <TopContextMenu title="My gifts" deposit={true} />
      <div className={styles.profileHeader}>
        <h1>SellPage</h1>
      </div>
      <BottomMenu />
    </div>
  );
}

export default SellPage;
