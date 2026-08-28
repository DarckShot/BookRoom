import { Link, NavLink } from 'react-router-dom';
import { AvatarCircleIcon, CalendarCheckIcon } from '../../../assets/icons/layout';
import styles from './Header.module.css';
import { useHeaderNavigation } from './useHeaderNavigation';

export const Header = () => {
  const { roomsPath, navigationItems, rememberRoomsPath } = useHeaderNavigation();

  return (
    <header className={styles.header}>
      <Link className={styles.brand} to={roomsPath} aria-label="BookRoom — к переговорным">
        <span className={styles.logo} aria-hidden="true">
          <CalendarCheckIcon />
        </span>
        <span className={styles.brandName}>BookRoom</span>
      </Link>

      <nav className={styles.nav} aria-label="Основная навигация">
        {navigationItems.map((item) => (
          <NavLink
            className={styles.navLink}
            to={item.to}
            key={item.to}
            onClick={rememberRoomsPath}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.profile} aria-label="Профиль пользователя">
        <span className={styles.userName}>Константин К.</span>
        <span className={styles.avatar} aria-hidden="true">
          <AvatarCircleIcon className={styles.avatarCircle} />
          <span className={styles.initials}>КК</span>
        </span>
      </div>
    </header>
  );
};
