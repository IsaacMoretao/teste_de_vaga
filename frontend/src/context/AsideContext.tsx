import { createContext, useContext, useState, ReactNode } from 'react';

// Tipagem do contexto
type MenuContextType = {
  hidden: 'hidden' | 'flex';
  toggleHidden: () => void;
};

// Contexto inicial
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Provider do contexto
export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hidden, setHidden] = useState<'hidden' | 'flex'>('hidden');

  const toggleHidden = () => {
    setHidden((prev) => (prev === 'flex' ? 'hidden' : 'flex'));
  };

  return (
    <MenuContext.Provider value={{ hidden, toggleHidden }}>
      {children}
    </MenuContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const UseMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu deve ser usado dentro de um MenuProvider');
  }
  return context;
};
