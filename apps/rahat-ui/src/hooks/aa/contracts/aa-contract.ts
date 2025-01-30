// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
