import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/errors';
import { useRegisterUserMutation } from '@/queries/useRegisterUserMutation';
import type { UserRegisterFormValues } from '@/types/forms';
import { ToastProps } from '@/types/toast';

export type { UserRegisterFormValues };

const useUserRegister = () => {
  const navigation = useNavigation();
  const { mutate: register, isPending, error } = useRegisterUserMutation();
  const [toast, setToast] = useState<ToastProps | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
    setFocus,
    setError,
    clearErrors,
  } = useForm<UserRegisterFormValues>();

  const onSubmit = handleSubmit((values) => {
    clearErrors();
    if (!isValid) {
      setToast({
        message: 'Noen av feltene er ikke fylt ut riktig',
        visible: true,
        preset: 'failure',
      });
      return;
    }
    setToast(null);

    register(values, {
      onSuccess: () => navigation.goBack(),
      onError: (registerError) => {
        // Map DRF field errors onto the matching form fields
        if (!(registerError instanceof ApiError)) {
          return;
        }
        Object.entries(registerError.fields).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            setError(field as keyof UserRegisterFormValues, { type: 'server', message: messages.join('\n') });
          }
        });
      },
    });
  });

  return {
    isRegisteringUser: isPending,
    onSubmit,
    isValid,
    isSubmitted,
    registerError: error,
    control,
    errors,
    setFocus,
    toast,
    setToast,
  };
};
export default useUserRegister;
