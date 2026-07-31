import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import { useLoginMutation } from '@/queries/useLoginMutation';

interface LoginFormValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const navigation = useNavigation();
  const { mutate: login, isPending, error } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setFocus,
  } = useForm<LoginFormValues>();

  const onSubmit = handleSubmit(({ email, password }) => {
    // goBack works since Login is always pushed from Membership
    login({ username: email, password }, { onSuccess: () => navigation.goBack() });
  });

  return { onSubmit, isLoggingIn: isPending, isSubmitted, setFocus, control, errors: { ...errors }, loginError: error };
};

export default useLogin;
