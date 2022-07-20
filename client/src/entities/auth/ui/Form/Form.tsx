import { FormButton } from './FormButton';
import { FormInput } from './FormInput';

type FormProps = {} & JSX.IntrinsicElements['form'];

const Form = ({ children, ...rest }: FormProps) => {
  return (
    <form
      {...rest}
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-y-11"
    >
      {children}
    </form>
  );
};

Form.FormInput = FormInput;
Form.FormButton = FormButton;

export { Form };
