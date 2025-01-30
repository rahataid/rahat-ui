// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './style.scss';

type HookReturnType = ReturnType<typeof withReactContent>;

export const useSwal = (): HookReturnType => {
  const MySwal: HookReturnType = withReactContent(Swal);

  return MySwal;
};

export const useAlert = () =>{
  const alert = useSwal();
  const toastMixin = alert.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', alert.stopTimer);
      toast.addEventListener('mouseleave', alert.resumeTimer);
    },
  });

  return toastMixin;

}
