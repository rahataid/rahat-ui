const ProjectInfo = () => {
  return (
    <div className="grid grid-cols-1 rounded-sm bg-card p-4 mb-2 shadow">
      <div>
        <p className="font-medium text-primary">Project 4</p>
      </div>
      <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
        <div>
          <p className="font-medium text-primary">Achyut</p>
          <p className="font-light">Project Manager</p>
        </div>
        <div>
          <p className="font-medium text-primary">12</p>
          <p className="font-light">Vendors</p>
        </div>
        <div>
          <p className="font-medium text-primary">01 Feb 2024</p>
          <p className="font-light">Start Date</p>
        </div>
        <div>
          <p className="font-medium text-primary">24 Feb 2024</p>
          <p className="font-light">End Date</p>
        </div>
      </div>
      <div>
        <p className="mt-4 sm:mt-8 sm:w-2/3">Janaki Rural Municiplality.</p>
      </div>
    </div>
  );
};

export default ProjectInfo;
