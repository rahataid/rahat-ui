// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { useTranslations } from "next-intl";
import { useAlert } from "apps/rahat-ui/src/components/swal";
import { useWriteRahatDonorMintTokens } from "./donor";

export const useMintTokens = () => {
    const toastMixin = useAlert();
    const tg = useTranslations('GLOBAL');
    return useWriteRahatDonorMintTokens({
        mutation: {
            onSuccess: () => {
                toastMixin.fire(tg('TOKENS_MINTED'));
            },
            onError: (err) => {
                toastMixin.fire({
                    title: tg('ERROR_WHILE_MINTING_TOKENS'),
                    icon: 'error',
                    text: err.message,
                });
            },
        },
    });
};
