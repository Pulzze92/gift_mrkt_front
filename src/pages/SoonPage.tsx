import TopContextMenu from '../components/TopContextMenu';
import styles from './style.module.scss';
import BottomMenu from '../components/BottomMenu';
function SoonPage() {
  return (
    <div className={styles.soonPageContainer}>
      <TopContextMenu title="My gifts" deposit={true} />
      <div className={styles.profileHeader}>
        <h1>SoonPage</h1>
      </div>
      <BottomMenu />
    </div>
  );
}

export default SoonPage;
