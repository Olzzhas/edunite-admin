import { createContext, useContext, useState } from 'react';
import AlertDialog from '../components/AlertDialog';

const AlertDialogContext = createContext(null);

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog must be used within an AlertDialogProvider');
  }
  return context;
};

export const AlertDialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    type: 'confirm',
  });

  const openDialog = ({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    type = 'confirm',
  }) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      type,
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  // Convenience methods for common dialog types
  const confirm = (props) => openDialog({ ...props, type: 'confirm' });
  const deleteConfirm = (props) => openDialog({ 
    title: 'Delete Confirmation', 
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    type: 'delete',
    ...props 
  });
  const info = (props) => openDialog({ ...props, type: 'info' });
  const success = (props) => openDialog({ ...props, type: 'success' });

  return (
    <AlertDialogContext.Provider
      value={{
        openDialog,
        closeDialog,
        confirm,
        deleteConfirm,
        info,
        success,
      }}
    >
      {children}
      <AlertDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        onConfirm={dialogState.onConfirm}
        type={dialogState.type}
      />
    </AlertDialogContext.Provider>
  );
};

export default AlertDialogContext;
