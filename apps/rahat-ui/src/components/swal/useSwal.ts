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
