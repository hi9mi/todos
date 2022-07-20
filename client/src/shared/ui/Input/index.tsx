import clsx from 'clsx';
import { forwardRef } from 'react';

export type InputProps = JSX.IntrinsicElements['input'] & {
  fullWidth?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ fullWidth = false, className, ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        className={clsx(
          'font-oswald border-2 rounded-lg  border-gray-700 focus:border-blue-500 px-8 lg:px-11 py-2 lg:py-3 bg-white text-base lg:text-medium font-normal',
          className,
          {
            'w-full': fullWidth,
          }
        )}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
