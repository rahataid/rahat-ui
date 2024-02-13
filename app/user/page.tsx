'use client';

import { useState } from 'react';
import Modal from 'react-modal';
import { FaCircleXmark } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import {
  useUserListQuery,
  userCreateMutation,
  userEditMutation,
  userDeleteMutation,
} from '@/libs/state/services/user/user';
import ModalContent from '@/app/user/components/Model/ModelContent';
import User from '@/app/user/components/User/user';

import { customStyles } from './constants/const';

const UserPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [modalType, setModalType] = useState('');
  const [userUuid, setUserUuid] = useState('');

  const createUser = userCreateMutation();
  const editUser = userEditMutation();
  const deleteUser = userDeleteMutation();

  const { isLoading, isError, data, error } = useUserListQuery({});

  const onSubmit = (data, id?: string) => {
    if (id) {
      editUser.mutate({ ...data, uuid: id });
    } else {
      createUser.mutate(data);
    }
    closeModal();
  };

  const onCreateClick = () => {
    setModalType('create');
    setShowModel(true);
  };

  const closeModal = () => {
    setShowModel(false);
    setModalType('');
  };

  const onUpdateClick = (uuid: string) => {
    setShowModel(true);
    setUserUuid(uuid);
    setModalType('update');
  };

  const onDeleteClick = (uuid: string) => {
    deleteUser.mutate({ uuid });
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={onCreateClick}>Create user</Button>
      {data?.data && data?.data.length > 0 ? (
        data?.data?.map((user) => (
          <User
            key={user.id}
            onUpdateClick={() => onUpdateClick(user.uuid)}
            onDeleteClick={() => onDeleteClick(user.uuid)}
            {...user}
          />
        ))
      ) : (
        <div className="flex justify-center">
          <p>No user found</p>
        </div>
      )}
      <Modal
        isOpen={showModel}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="z-50 cursor-pointer" onClick={() => closeModal()}>
          <FaCircleXmark />
        </div>
        <ModalContent
          modalType={modalType}
          onSubmit={onSubmit}
          uuid={userUuid}
        />
      </Modal>
    </div>
  );
};

export default UserPage;
