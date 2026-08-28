import { paths } from './paths';

export const isRoomsRoute = (pathname: string) =>
  pathname === paths.rooms || pathname.startsWith(`${paths.rooms}/`);

export const createRoomsPath = (search: string) => `${paths.rooms}${search}`;
