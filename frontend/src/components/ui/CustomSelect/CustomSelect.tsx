import { CheckIcon, ChevronDownIcon } from '../../../assets/icons/ui';
import { classNames } from '../../../utils/classNames';
import styles from './CustomSelect.module.css';
import type { CustomSelectProps } from './types';
import { useCustomSelect } from './useCustomSelect';

export const CustomSelect = ({
  ariaLabel,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  prefix,
  className,
  triggerClassName,
  menuClassName,
  placeholderClassName,
  chevronVisibility = 'always',
  ariaInvalid = false,
  ariaDescribedBy,
}: CustomSelectProps) => {
  const { rootRef, triggerRef, state, meta, actions } = useCustomSelect({
    value,
    options,
    onChange,
    disabled,
  });

  return (
    <div className={classNames(styles.root, className)} ref={rootRef}>
      <button
        className={classNames(styles.trigger, triggerClassName)}
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={state.isOpen}
        aria-controls={meta.listboxId}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={actions.toggleMenu}
        onKeyDown={actions.handleTriggerKeyDown}
      >
        {prefix}
        <span
          className={classNames(
            styles.value,
            state.selectedOption ? undefined : styles.placeholder,
            state.selectedOption ? undefined : placeholderClassName,
          )}
        >
          {state.selectedOption?.displayLabel ?? state.selectedOption?.label ?? placeholder}
        </span>
        {chevronVisibility !== 'never' && (chevronVisibility === 'always' || !disabled) ? (
          <ChevronDownIcon className={classNames(styles.chevron, state.isOpen && styles.open)} />
        ) : null}
      </button>

      {state.isOpen ? (
        <div
          className={classNames(styles.menu, menuClassName)}
          id={meta.listboxId}
          role="listbox"
          aria-label={ariaLabel}
          onKeyDown={actions.handleMenuKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;

            return (
              <button
                className={classNames(styles.option, isSelected && styles.selected)}
                key={option.value}
                ref={(element) => {
                  actions.setOptionRef(index, element);
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={index === state.activeIndex ? 0 : -1}
                onFocus={() => actions.setActiveIndex(index)}
                onClick={() => actions.selectOption(option)}
              >
                <span>{option.label}</span>
                {isSelected ? <CheckIcon className={styles.check} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
