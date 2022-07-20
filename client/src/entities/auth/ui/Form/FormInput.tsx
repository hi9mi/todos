import { forwardRef } from 'react';

import { Input, InputProps } from '@shared/ui/Input';

type FormInputProps = {
  label?: string;
} & InputProps;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, ...rest }, ref) => {
    return (
      <label htmlFor={id}>
        <span className="empty:hidden">{label}</span>
        <Input {...rest} ref={ref} id={id} />
      </label>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
