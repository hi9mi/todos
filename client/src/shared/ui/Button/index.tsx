import clsx from 'clsx';

type ButtonTypes = 'primary' | 'secondary' | 'outline';

export type ButtonProps = Omit<JSX.IntrinsicElements['button'], 'type'> & {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  type?: ButtonTypes;
  htmlType?: JSX.IntrinsicElements['button']['type'];
  fullWidth?: boolean;
};

const textSize = 'text-base lg:text-medium font-medium';

const padding = 'px-4 lg:px-7 py-2 lg:py-3';

const borderRadius = 'rounded-lg';

const focusOutline = 'focus:outline-blue-500 outline-offset-4';

const color = {
  primary: 'text-white',
  secondary: 'text-slate-700 hover:text-white',
  outline: 'text-slate-700 hover:text-white ',
};

const backgroundColors = {
  primary: 'bg-blue-500 hover:bg-blue-700 active:translate-y-1',
  secondary: 'bg-transparent hover:bg-blue-500 active:translate-y-1',
  outline: 'bg-light-button hover:bg-blue-500 active:translate-y-1',
};

const border = {
  primary: 'border-none',
  secondary: 'border-2 border-blue-500 hover:border-transparent',
  outline: 'border-none',
};

const Button = ({
  type = 'primary',
  className = '',
  disabled = false,
  fullWidth = false,
  htmlType,
  children,
  ...rest
}: ButtonProps) => {
  const baseClasses = [
    'uppercase',
    'font-oswald',
    textSize,
    border[type],
    backgroundColors[type],
    color[type],
    padding,
    borderRadius,
    focusOutline,
  ];

  return (
    <button
      {...rest}
      className={clsx(baseClasses.join(' '), className, {
        'w-full': fullWidth,
        'disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-gray-300':
          disabled,
        'transition ease-in-out duration-300 hover:cursor-pointer': !disabled,
      })}
      disabled={disabled}
      type={htmlType}
    >
      {children}
    </button>
  );
};

export { Button };
