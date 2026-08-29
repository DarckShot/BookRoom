import { BuildingIcon } from '../../../../assets/icons/rooms';
import styles from './NoOfficeState.module.css';

export const NoOfficeState = () => (
  <main className={styles.state}>
    <div className={styles.iconCircle}>
      <BuildingIcon className={styles.icon} />
    </div>
    <h1 className={styles.title}>Выберите офис</h1>
    <p className={styles.description}>
      Для просмотра доступных переговорных сначала выберите офис <br />
      из списка выше
    </p>
  </main>
);
