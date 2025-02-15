import React, { createContext, useState, useContext } from 'react';

interface DialogContextType {
  activeDialog: string | null;
  setActiveDialog: (username: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitActiveDialog = () => {
    const storedActiveDialog = localStorage.getItem('activeDialog');
    return storedActiveDialog ? JSON.parse(storedActiveDialog) : null;
  };

  const [activeDialog, setActiveDialog] = useState<string | null>(getInitActiveDialog);

  const handleSetActiveDialog = (username: string) => {
    setActiveDialog(username);
    localStorage.setItem('activeDialog', JSON.stringify(username));
  };

  return (
    <DialogContext.Provider value={{ activeDialog, setActiveDialog: handleSetActiveDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}; 