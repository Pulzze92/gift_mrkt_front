import styles from './style.module.scss';
import TopContextMenu from '../components/TopContextMenu';
import BottomMenu from '../components/BottomMenu';

function OrderPage() {
  return (
    <div className={styles.orderPageContainer}>
      <TopContextMenu title="My gifts" deposit={true} />
      <div className={styles.profileHeader}>
        <h1>OrderPage</h1>
      </div>
      <BottomMenu />
    </div>
  );
}

export default OrderPage;
