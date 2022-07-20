import { Form } from '@/entities/auth';

type SigninFormProps = {};

const SigninForm = (props: SigninFormProps) => {
  return (
    <Form className="">
      <Form.FormInput />
      <Form.FormInput />
      <Form.FormButton>Sign in</Form.FormButton>
    </Form>
  );
};

export { SigninForm };
