import { paths } from './paths';

export const isRoomsRoute = (pathname: string) =>
  pathname === paths.rooms || pathname.startsWith(`${paths.rooms}/`);

export const createRoomsPath = (search: string) => `${paths.rooms}${search}`;

export const createOfficeRoomsPath = (search: string, officeId: string) => {
  const searchParams = new URLSearchParams(search);
  searchParams.set('officeId', officeId);

  return createRoomsPath(`?${searchParams.toString()}`);
};
