import { DisplayIcon, VideoIcon, WhiteboardIcon } from '../../assets/icons/rooms';
import { CheckIcon } from '../../assets/icons/ui';
import { ROOM_FEATURE_CODES } from './constants';

interface RoomFeatureIconProps {
  code: string;
}

export const RoomFeatureIcon = ({ code }: RoomFeatureIconProps) => {
  switch (code) {
    case ROOM_FEATURE_CODES.display:
      return <DisplayIcon />;
    case ROOM_FEATURE_CODES.whiteboard:
      return <WhiteboardIcon />;
    case ROOM_FEATURE_CODES.video:
      return <VideoIcon />;
    default:
      return <CheckIcon />;
  }
};
