import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { paths } from '../../../router/paths';
import { createRoomsPath, isRoomsRoute } from '../../../router/utils';
import { NAVIGATION_ITEMS } from './constants';

export const useHeaderNavigation = () => {
  const { pathname, search } = useLocation();
  const [savedRoomsPath, setSavedRoomsPath] = useState(paths.rooms);
  const roomsPath = isRoomsRoute(pathname) ? createRoomsPath(search) : savedRoomsPath;
  const rememberRoomsPath = () => {
    if (isRoomsRoute(pathname)) {
      setSavedRoomsPath(createRoomsPath(search));
    }
  };

  return {
    roomsPath,
    navigationItems: NAVIGATION_ITEMS.map((item) => ({
      ...item,
      to: item.to === paths.rooms ? roomsPath : item.to,
    })),
    rememberRoomsPath,
  };
};
