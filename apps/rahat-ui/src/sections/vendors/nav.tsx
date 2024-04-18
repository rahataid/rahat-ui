'use client';

import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { useUserStore } from '@rumsan/react-query';
import { Eye } from 'lucide-react';
import ProjectAssign from '../projects/el/vendors/project.assign';
import ProjectConfirm from '../projects/el/vendors/project.confitm';
import { useBoolean } from '../../hooks/use-boolean';

// type IProps = {
//   // onAddUsersClick: VoidFunction;
//   onTabChange: (tab: string) => void;
// };

export default function Nav() {
  const totalUser = useUserStore.getState().totalUser;
  const projectAssignModal = useBoolean();
  const projectConfirmModal = useBoolean();

  const handleOpenProjectAssignModal = () => {
    projectAssignModal.onToggle();
    projectConfirmModal.onFalse();
  };

  const handleSubmitProjectAssignModal = () => {
    projectAssignModal.onFalse();
    projectConfirmModal.onTrue();
  };

  const handleSubmitConfirmProjectModal = () => {
    projectConfirmModal.onFalse();
  };
  const handleCloseConfirmProjectModal = () => {
    projectConfirmModal.onFalse();
  };

  return (
    <>
      <div className="bg-card border-b">
        <div className="flex justify-between items-center p-4">
          <h1 className="font-semibold text-xl text-primary">Vendors</h1>
        </div>
      </div>
      <ScrollArea className="h-auto mb-2 bg-card">
        <div className="px-4">
          <nav>
            <div
              //   onClick={() => handleTabClick(USER_NAV_ROUTE.DEFAULT)}
              className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground mt-2"
            >
              <div className="flex items-center gap-3">
                <Eye size={18} strokeWidth={1.5} />
                <p>Vendors </p>
              </div>
              <p></p>
            </div>
          </nav>
        </div>
        <ProjectAssign
          open={projectAssignModal.value}
          handleModal={handleOpenProjectAssignModal}
          handleSubmit={handleSubmitProjectAssignModal}
        />
        <ProjectConfirm
          open={projectConfirmModal.value}
          handleClose={handleCloseConfirmProjectModal}
          handleSubmit={handleSubmitConfirmProjectModal}
        />
      </ScrollArea>
    </>
  );
}
