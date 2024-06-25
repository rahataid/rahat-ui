import { useRSQuery } from '@rumsan/react-query';
import { useWriteRahatTreasuryCreateToken } from '../generated-hooks';
import Swal from 'sweetalert2';
import { useMutation } from '@tanstack/react-query';

export const useTokenCreate = () => {
  const { queryClient } = useRSQuery();
  const treasuryCreateToken = useWriteRahatTreasuryCreateToken();
  const alert = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation(
    {
      onSettled(data, error, variables, context) {
        console.log('data', data);
        console.log('error', error);
        console.log('variables', variables, context);
      },
      onSuccess: () => {
        alert.fire({
          icon: 'success',
          title: 'Token Created Successfully',
        });
      },
      onError: (error) => {
        console.log('error', error.message);
        alert.fire({
          icon: 'error',
          title: 'Error minting and approving token',
          text: 'Error Creating Token',
        });
      },
      mutationFn: async ({
        _name,
        _symbol,
        _description,
        decimals,
        _manager,
        rahatTreasuryAddress,
      }: {
        _name: string;
        _symbol: string;
        _description: string;
        decimals: number;
        _manager: `0x${string}`;
        rahatTreasuryAddress: `0x${string}`;
      }) => {
        return treasuryCreateToken.writeContractAsync({
          args: [_name, _symbol, _description, decimals, _manager],
          address: rahatTreasuryAddress,
        });
      },
    },
    queryClient,
  );
};
