import { Link, NavLink } from 'react-router-dom';

const CalendarIcon = () => {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M8 3v3m8-3v3M5.5 8.5h13M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3.5 9 1.75 1.75L15.5 12" />
    </svg>
  );
};

export const Header = () => {
  return (
    <header className="header">
      <Link className="header__brand" to="/rooms" aria-label="BookRoom — к переговорным">
        <span className="header__logo" aria-hidden="true">
          <CalendarIcon />
        </span>
        <span className="header__brand-name">BookRoom</span>
      </Link>

      <nav className="header__nav" aria-label="Основная навигация">
        <NavLink className="header__nav-link" to="/rooms">
          Переговорные
        </NavLink>
        <NavLink className="header__nav-link" to="/bookings">
          Мои бронирования
        </NavLink>
      </nav>

      <div className="header__profile" aria-label="Профиль пользователя">
        <span className="header__user-name">Константин К.</span>
        <span className="header__avatar" aria-hidden="true">
          КК
        </span>
      </div>
    </header>
  );
};
