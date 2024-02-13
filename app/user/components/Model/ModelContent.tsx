import { UserForm } from '../UserForm/UserForm';

type IProps = {
  modalType: string;
  onSubmit: (data, uuid?: string) => void;
  uuid: string;
};

const ModalContent = ({ modalType, onSubmit, uuid }: IProps) => {
  switch (modalType) {
    case 'create':
      return <UserForm onSubmit={onSubmit} title="Add User" />;
    case 'update':
      return <UserForm onSubmit={onSubmit} title="Update User" uuid={uuid} />;
    default:
      return null;
  }
};

export default ModalContent;
