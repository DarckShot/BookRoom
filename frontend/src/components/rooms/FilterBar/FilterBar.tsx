import { UsersIcon } from '../../../assets/icons/rooms';
import {
  CAPACITY_OPTIONS,
  DURATION_OPTIONS,
  ROOM_WORKING_DAY_START,
} from '../../../constants/roomFilters';
import type { RoomFiltersController } from '../../../types/roomFilters';
import { classNames } from '../../../utils/classNames';
import { formatRoomFilterDate } from '../../../utils/roomFilters';
import { CustomSelect } from '../../ui/CustomSelect/CustomSelect';
import { DatePicker } from '../DatePicker/DatePicker';
import { FilterField } from '../FilterField/FilterField';
import { TimeInput } from '../TimeInput/TimeInput';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  controller: RoomFiltersController;
}

export const FilterBar = ({ controller }: FilterBarProps) => {
  const {
    actions,
    meta: constraints,
    state: { isDisabled, values },
  } = controller;

  return (
    <section
      className={classNames(styles.bar, isDisabled && styles.disabled)}
      aria-label="Фильтры переговорных"
    >
      <FilterField label="Дата">
        <DatePicker
          className={styles.dateControl}
          value={values.date}
          min={constraints.minDate}
          max={constraints.maxDate}
          formattedValue={values.date ? formatRoomFilterDate(values.date) : ''}
          disabled={isDisabled}
          onChange={actions.setDate}
        />
      </FilterField>

      <FilterField label="Время начала">
        <TimeInput
          key={values.startTime}
          className={styles.timeControl}
          value={values.startTime}
          min={ROOM_WORKING_DAY_START}
          max={constraints.latestStartTime}
          disabled={isDisabled}
          onChange={actions.setStartTime}
        />
      </FilterField>

      <FilterField label="Длительность">
        <CustomSelect
          className={styles.durationControl}
          menuClassName={styles.durationMenu}
          ariaLabel="Длительность"
          value={isDisabled ? '' : String(values.durationMinutes)}
          options={DURATION_OPTIONS}
          placeholder="Выберите"
          disabled={isDisabled}
          onChange={actions.setDuration}
        />
      </FilterField>

      <FilterField label="Вместимость">
        <CustomSelect
          className={styles.capacityControl}
          ariaLabel="Минимальная вместимость"
          value={isDisabled ? '' : String(values.minCapacity)}
          options={CAPACITY_OPTIONS}
          placeholder="Не указано"
          prefix={<UsersIcon className={styles.icon} />}
          chevronVisibility="enabled"
          disabled={isDisabled}
          onChange={actions.setMinCapacity}
        />
      </FilterField>
    </section>
  );
};
