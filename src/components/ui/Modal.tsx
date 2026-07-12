import { X } from 'lucide-react';
import type { ReactNode } from 'react';

// "children" représente tout ce qui sera placé ENTRE les balises <Modal> et </Modal>
// lors de l'utilisation du composant. Son type, "ReactNode", signifie
// "tout ce que React sait afficher" (texte, JSX, liste d'éléments...).
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  // Si la Modal n'est pas ouverte, on ne retourne rien : elle n'existe
  // simplement pas dans le DOM. C'est un "rendu conditionnel" très courant en React.
  if (!isOpen) return null;

  return (
    // Le fond semi-transparent qui recouvre toute la page
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      {/* La boîte blanche de la Modal elle-même */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;