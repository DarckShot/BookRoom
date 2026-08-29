import { FormProvider } from 'react-hook-form';
import { Modal } from '../../ui/Modal/Modal';
import { BOOKING_CONFLICT_VIEW, BOOKING_FORM_VIEW } from './constants';
import { BookingConflict } from './BookingConflict';
import { BookingForm } from './BookingForm';
import styles from './BookingDialog.module.css';
import type { BookingDialogProps } from './types';
import { useBookingDialog } from './useBookingDialog';

export const BookingDialog = (props: BookingDialogProps) => {
  const { form, data, status, actions } = useBookingDialog(props);
  const content = {
    [BOOKING_FORM_VIEW]: (
      <BookingForm
        room={props.room}
        minDate={data.minDate}
        maxDate={data.maxDate}
        isPending={status.isPending}
        onCancel={actions.cancel}
        onSubmit={actions.submit}
      />
    ),
    [BOOKING_CONFLICT_VIEW]: <BookingConflict onChooseAnotherTime={actions.chooseAnotherTime} />,
  };

  return (
    <FormProvider {...form}>
      <Modal
        ariaLabelledBy={
          data.view === BOOKING_FORM_VIEW ? 'booking-dialog-title' : 'booking-conflict-title'
        }
        onClose={actions.cancel}
        panelClassName={
          data.view === BOOKING_CONFLICT_VIEW ? styles.conflictPanel : styles.formPanel
        }
      >
        {content[data.view]}
      </Modal>
    </FormProvider>
  );
};
