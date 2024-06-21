import React from 'react';

const Confirmation = () => {
  return (
    <div className="grid grid-cols-12 p-4">
      <div className="col-span-12 h-[calc(100vh-482px)] bg-card rounded-sm p-4">
        <h1 className="text-gray-700 text-xl font-medium">CONFIRMATION</h1>
        <div className="col-span-6">
          <div className="bg-stone-50 h-full p-3 rounded-sm mt-4">
            <div className="flex flex-col gap-8 p-3">
              <div className="flex flex-col gap-2">
                <p>Your Token Name</p>
                <p>Token Name</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Your Token Symbol</p>
                <p>Symbol</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Your Token Count</p>
                <p>100</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Description</p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laudantium eum quidem ipsam enim cupiditate ea minus, amet
                  adipisci ullam cum nam. Culpa reiciendis explicabo eum
                  asperiores tenetur officia quasi obcaecati.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
