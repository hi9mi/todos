import { Button, ButtonProps } from '@shared/ui/Button';

type FormButtonProps = {} & Omit<ButtonProps, 'htmlType'>;

const FormButton = ({ children, ...rest }: FormButtonProps) => {
  return (
    <Button {...rest} htmlType="submit">
      {children}
    </Button>
  );
};

export { FormButton };
