import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiX } from "react-icons/fi";

const AlertDialog = ({
   isOpen,
   onClose,
   onConfirm,
   onCancel,
   title = "Confirmation",
   message = "Are you sure you want to proceed?",
   confirmText = "Confirm",
   cancelText = "Cancel",
   type = "confirm", // 'confirm', 'delete', 'info', 'success'
}) => {
   const dialogRef = useRef(null);

   useEffect(() => {
      const handleEscape = (e) => {
         if (e.key === "Escape" && isOpen) {
            if (onCancel) onCancel();
            onClose();
         }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
   }, [isOpen, onClose, onCancel]);

   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "auto";
      }

      return () => {
         document.body.style.overflow = "auto";
      };
   }, [isOpen]);

   if (!isOpen) return null;

   const getIcon = () => {
      switch (type) {
         case "delete":
            return <FiAlertTriangle className="h-6 w-6 text-red-600" />;
         case "info":
            return <FiInfo className="h-6 w-6 text-blue-600" />;
         case "success":
            return <FiCheckCircle className="h-6 w-6 text-green-600" />;
         default:
            return <FiInfo className="h-6 w-6 text-primary-600" />;
      }
   };

   const getConfirmButtonClass = () => {
      switch (type) {
         case "delete":
            return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
         case "info":
            return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
         case "success":
            return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
         default:
            return "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500";
      }
   };

   return (
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
         <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
               className="fixed inset-0 transition-opacity backdrop-blur-sm bg-black bg-opacity-50 dark:bg-opacity-70"
               aria-hidden="true"
               onClick={() => {
                  if (onCancel) onCancel();
                  onClose();
               }}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full bg-card">
               <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                     type="button"
                     className="rounded-md text-tertiary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 bg-card"
                     onClick={() => {
                        if (onCancel) onCancel();
                        onClose();
                     }}
                  >
                     <span className="sr-only">Close</span>
                     <FiX className="h-6 w-6" />
                  </button>
               </div>

               <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-card">
                  <div className="sm:flex sm:items-start">
                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                        {getIcon()}
                     </div>
                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-primary" id="modal-title">
                           {title}
                        </h3>
                        <div className="mt-2">
                           <p className="text-sm text-secondary">{message}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-secondary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                     type="button"
                     className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${getConfirmButtonClass()}`}
                     onClick={() => {
                        onConfirm();
                        onClose();
                     }}
                  >
                     {confirmText}
                  </button>
                  <button
                     type="button"
                     className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm bg-card text-primary border-light"
                     onClick={() => {
                        if (onCancel) onCancel();
                        onClose();
                     }}
                  >
                     {cancelText}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AlertDialog;
