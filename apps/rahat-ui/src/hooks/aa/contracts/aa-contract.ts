import { useAlert } from "apps/rahat-ui/src/components/swal";
import { useWriteRahatDonorMintTokens } from "./donor";

export const useMintTokens = () => {
    const toastMixin = useAlert();
    return useWriteRahatDonorMintTokens({
        mutation: {
            onSuccess: () => {
                toastMixin.fire('Tokens minted.');
            },
            onError: (err) => {
                toastMixin.fire({
                    title: 'Error while minting tokens.',
                    icon: 'error',
                    text: err.message,
                });
            },
        },
    });
};
