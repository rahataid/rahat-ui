'use client';

import { KanbanSquare } from 'lucide-react';
import { useState } from 'react';
import { PROJECT_NAV_ROUTE } from '../../constants/project.const';

type IProps = {
  title: string;
  handleNav: (item: string) => void;
  setProjectType: (item: string) => void;
};

const Nav = ({ title, handleNav, setProjectType }: IProps) => {
  const [showProject, setShowProject] = useState(false);

  return (
    <>
      <h1 className="px-4 pt-4 pb-2 font-semibold text-xl text-primary">
        {title}
      </h1>
      {/* <ScrollArea className="h-auto"> */}
      <div>
        <nav className="text-muted-foreground p-2">
          <div>
            <div
              className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => {
                handleNav(PROJECT_NAV_ROUTE.DEFAULT);
                setShowProject(!showProject);
                setProjectType('');
              }}
            >
              <div className="flex items-center gap-3">
                <KanbanSquare size={18} strokeWidth={1.5} />
                <p>Projects</p>
              </div>
              <p className="text-sm">32</p>
            </div>

            <div
              className={`pl-7 transition-all ease-in-out duration-300 ${
                showProject ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
              }`}
            >
              <div
                className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => setProjectType('CVA')}
              >
                <div className="flex items-center gap-3">
                  <p>CVA</p>
                </div>
                <p className="text-sm">9</p>
              </div>
              <div
                className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => setProjectType('AA')}
              >
                <div className="flex items-center gap-3">
                  <p>AA</p>
                </div>
                <p className="text-sm">9</p>
              </div>
              <div
                className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => setProjectType('EL')}
              >
                <div className="flex items-center gap-3">
                  <p>EL</p>
                </div>
                <p className="text-sm">9</p>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <UsersRound size={18} strokeWidth={1.5} />
                <p>Beneficiaries</p>
              </div>
              <p className="text-sm">128</p>
            </div>
            <div className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <Store size={18} strokeWidth={1.5} />
                <p>Vendors</p>
              </div>
              <p className="text-sm">32</p>
            </div>
            <div className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <Speech size={18} strokeWidth={1.5} /> <p>Campaigns</p>
              </div>
              <p className="text-sm">9</p>
            </div> */}
        </nav>
      </div>
    </>
  );
};
export default Nav;
