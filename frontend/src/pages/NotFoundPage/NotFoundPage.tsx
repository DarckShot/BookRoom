import { Link } from 'react-router-dom';
import { paths } from '../../router/paths';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => (
  <main className={styles.page}>
    <p className={styles.code}>404</p>
    <h1>Ничего не найдено</h1>
    <p className={styles.description}>
      Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.
    </p>
    <Link className={styles.link} to={paths.rooms}>
      Вернуться к переговорным
    </Link>
  </main>
);
