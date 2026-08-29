import { OfficeSeparatorIcon } from '../../../../assets/icons/layout';
import { useCurrentTime } from '../../../../hooks/useCurrentTime';
import type { Office } from '../../../../types/office';
import { classNames } from '../../../../utils/classNames';
import { formatOfficeAddress, formatOfficeTime, getTimeZoneLabel } from '../../../../utils/office';
import styles from '../OfficePanel.module.css';

const OfficeMetadataPlaceholder = () => (
  <div className={classNames(styles.meta, styles.metaPlaceholder)}>
    <address>Адрес не выбран</address>
    <OfficeSeparatorIcon className={styles.separator} />
    <span>Местное время: —</span>
  </div>
);

const SelectedOfficeMetadata = ({ office }: { office: Office }) => {
  const now = useCurrentTime();

  return (
    <div className={styles.meta}>
      <address>{formatOfficeAddress(office.address)}</address>
      <OfficeSeparatorIcon className={styles.separator} />
      <time dateTime={now.toISOString()}>
        Местное время: {formatOfficeTime(now, office.timezone)} {getTimeZoneLabel(office.timezone)}
      </time>
    </div>
  );
};

export const OfficeMetadata = ({ office }: { office?: Office }) =>
  office ? <SelectedOfficeMetadata office={office} /> : <OfficeMetadataPlaceholder />;
