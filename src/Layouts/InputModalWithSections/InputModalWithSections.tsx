import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonHeader, IonModal } from '@ionic/react';
import ModalSearchBar from '../../Shared/Components/ModalSearchBar/ModalSearchBar';
import ModalToolbar from '../../Shared/Components/ModalToolbar/ModalToolbar';
import './InputModalWithSections.scss';
import { Section } from '../../Shared/Components/Section/Section';


interface ListOfOptionsItem {
  category: string | null;
  options: string[];
}

interface InputModalWithSectionsProps {
  modalRef?: React.RefObject<HTMLIonModalElement>;
  optionName: string;
  listOfOptions: ListOfOptionsItem[];
  clearSelections: () => void;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
}

const InputModalWithSections: React.FC<InputModalWithSectionsProps> = ({
  modalRef = useRef<HTMLIonModalElement>(null),
  optionName,
  listOfOptions,
  clearSelections,
  isOpen = false,
  setIsOpen
}) => {
  const [searchText, setSearchText] = useState('');
  const [showError, setShowError] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (listOfOptions) {
      const categoriesList = listOfOptions.map(category => category.category || 'NO CATEGORY');
      setCategories(categoriesList);
    }
  }, [listOfOptions]);

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.dismiss();
      setShowError(false);
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <IonModal
      className="general-modal-styles"
      isOpen={isOpen}
      ref={modalRef}
      onDidDismiss={() => setIsOpen && setIsOpen(false)}
    >
      <IonHeader>
        <ModalToolbar
          handleSave={closeModal}
          toolbarTitle={optionName}
          handleReset={clearSelections}
          customButtons={[]}
          handleBack={closeModal}
          showReset={false}
        />
        <ModalSearchBar 
          searchText={searchText} 
          setSearchText={setSearchText} 
          showSearchBar={true} 
        />
      </IonHeader>
      <IonContent 
        color="tertiary"
      >
        <div className='sections-container'>
          {categories.map((category: string, i: number) => (
            <Section
              key={i}
              title={category}
              open={true}
              setOpen={() => { } }
              onAddClick={() => { } } >
                <p> OPTIONS </p>
              </Section>  
          ))}
        </div>
        
      </IonContent>
    </IonModal>
  );
};

export default InputModalWithSections;