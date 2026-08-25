import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <h1>Ничего не найдено</h1>
      <p className="not-found__description">
        Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.
      </p>
      <Link className="not-found__link" to="/rooms">
        Вернуться к переговорным
      </Link>
    </main>
  );
};
