import { useDeleteUserMutation } from '@/queries/useDeleteUserMutation';

const useUserDelete = () => {
  const { mutate: deleteAccount, isPending, error } = useDeleteUserMutation();

  return {
    onPress: () => deleteAccount(),
    isDeletingUser: isPending,
    deleteUserError: error,
  };
};
export default useUserDelete;
