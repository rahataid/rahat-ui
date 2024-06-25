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
        name,
        symbol,
        description,
        decimals,
        manager,
        rahatTreasuryAddress,
      }: {
        name: string;
        symbol: string;
        description: string;
        decimals: number;
        manager: `0x{string}`;
        rahatTreasuryAddress: `0x{string}`;
      }) => {
        return treasuryCreateToken.writeContractAsync({
          args: [name, symbol, description, decimals, manager],
          address: rahatTreasuryAddress,
        });
      },
    },
    queryClient,
  );
};
