import Lucide from "../../base-components/Lucide";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
// -------------------------------------------------------------------------------------------------------------------

function Main() {
  const [successModalPreview, setSuccessModalPreview] = useState(true);
  
  return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 mt-5">
          {/* Success Modal */}
            <Dialog
              open={successModalPreview}
              onClose={() => setSuccessModalPreview(true)}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center block sm:p-0">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-40 transition-opacity duration-1000 ease-in-out" />

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Dialog.Panel
                  className="inline-block align-bottom bg-white rounded-lg 
                text-left overflow-hidden shadow-xl transform transition-all 
                sm:my-8 sm:align-middle sm:max-w-lg sm:w-full transition duration-1000 ease-in-out"
                >
                  <div className="p-5 text-center">
                    <Lucide
                      icon="CheckCircle"
                      className="w-16 h-16 mx-auto mt-3 text-success"
                    />
                    <div className="mt-5 text-3xl ">
                      Thank You!
                    </div>

                    <div className="mt-2 italic">
                      The Form was Submitted Successfully.
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
        </div>
      </div>
  );
}

export default Main;

//--------------------------------------------------------------------------------------------------

          {/* BEGIN: Success! */}
          // <div className="col-span-12 lg:col-span-8 lg:col-start-3">
          // <div className="intro-y box">
          //     <div className="text-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
          //       <h2 className="text-lg font-bold">
          //         Water Today's Water Expo
          //       </h2>
          //       <p className="mt-2 italic">
          //         Check Your Registered Mail Id For Futher Updates!
          //       </p>
          //     </div>
          //   </div>
          // </div>
          {/* END: Success! */}