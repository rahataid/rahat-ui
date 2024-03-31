import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './style.scss';

type HookReturnType = ReturnType<typeof withReactContent>;

export const useSwal = (): HookReturnType => {
  const MySwal: HookReturnType = withReactContent(Swal);

  return MySwal;
};
