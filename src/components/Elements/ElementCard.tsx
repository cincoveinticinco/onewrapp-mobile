import React, { useContext, useRef } from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonButton,
  IonItem,
  IonTitle,
  useIonToast,
} from '@ionic/react';
import { PiProhibitLight, PiTrashSimpleLight } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import HighlightedText from '../../components/Shared/HighlightedText/HighlightedText';
import './ElementCard.scss';
import secondsToMinSec from '../../utils/secondsToMinSec';
import floatToFraction from '../../utils/floatToFraction';
import { checkmarkCircle } from 'ionicons/icons';
import DropDownButton from '../Shared/DropDownButton/DropDownButton';
import useIsMobile from '../../hooks/Shared/useIsMobile';
import EditionModal from '../Shared/EditionModal/EditionModal';
import DatabaseContext, { DatabaseContextProps } from '../../context/Database.context';
import useErrorToast from '../../hooks/Shared/useErrorToast';
import InputAlert from '../../Layouts/InputAlert/InputAlert';
import useWarningToast from '../../hooks/Shared/useWarningToast';

interface Element {
  elementName: string;
  elementsQuantity: number;
  scenesQuantity: number;
  protectionQuantity: number;
  pagesSum: number;
  estimatedTimeSum: number;
  episodesQuantity: number;
  participation: string;
  category: string;
  categoryName: string;
  elementCategory?: string;
}

interface ElementCardProps {
  data: Element;
  searchText: string;
  section: 'category' | 'element';
  isOpen?: boolean;
  onClick?: () => void;
  elementsQuantity?: number;
  validationFunction: (name: string, currentName: string) => (boolean | string);
  permissionType?: number | null;
}

const InfoLabel: React.FC<{ label: string, value: string | number, symbol?: string}> = ({ label, value, symbol }) => (
  <p className="info-label">
    <span className="value-part">
      {value}
      <span className="symbol-part">{symbol}</span>
    </span>
    <span className="label-part">{label}</span>
  </p>
);

const ElementCard: React.FC<ElementCardProps> = ({
  data, searchText, section, isOpen = false, onClick, elementsQuantity, validationFunction, permissionType,
}) => {
  const isMobile = useIsMobile();
  const { oneWrapDb, projectId } = useContext<DatabaseContextProps>(DatabaseContext);
  const deleteElementAlert = useRef<HTMLIonAlertElement>(null);
  const deleteCategoryAlert = useRef<HTMLIonAlertElement>(null);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const disableEditions = permissionType !== 1;

  const openEditModal = () => {
    modalRef.current?.present();
  };

  const openDeleteElementAlert = () => {
    deleteElementAlert.current?.present();
  };

  const openDeleteCategoryAlert = () => {
    deleteCategoryAlert.current?.present();
  };

  const [presentToast] = useIonToast();

  const successMessageSceneToast = (message: string) => {
    presentToast({
      message,
      duration: 2000,
      icon: checkmarkCircle,
      position: 'top',
      cssClass: 'success-toast',
    });
  };

  const warningMessageToast = useWarningToast();

  const errorToast = useErrorToast();

  const divideIntegerFromFraction = (value: string) => {
    const [integer, fraction] = value.split(' ');
    return {
      integer,
      fraction,
    };
  };

  const fraction = floatToFraction(data.pagesSum);

  const fractionPart = divideIntegerFromFraction(fraction).fraction;
  const integerPart = divideIntegerFromFraction(fraction).integer;

  const divideMinutesFromSeconds = (value: string) => {
    const [minutes, seconds] = value.split(':');
    return {
      minutes,
      seconds,
    };
  };

  const minutesSeconds = secondsToMinSec(data.estimatedTimeSum);

  const { minutes } = divideMinutesFromSeconds(minutesSeconds);
  const { seconds } = divideMinutesFromSeconds(minutesSeconds);

  const elementName = () => {
    if (data.elementName) {
      if (data.elementName.length > 2) {
        return data.elementName;
      }

      return 'N/A';
    }
  };

  const scenesToEditWithElement = () => oneWrapDb?.scenes.find({
    selector: {
      'elements.elementName': data.elementName,
    },
  }).exec();

  const scenesToEditWithCategory = () => oneWrapDb?.scenes.find({
    selector: {
      'elements.categoryName': data.categoryName,
    },
  }).exec();

  const formElementInputs = [
    {
      label: 'Category Name',
      type: 'text',
      fieldKeyName: 'categoryName',
      placeholder: 'INSERT',
      required: false,
      inputName: `add-category-name-input-${data.categoryName || Math.random() * 1000}`,
    },
    {
      label: 'Element Name',
      type: 'text',
      fieldKeyName: 'elementName',
      placeholder: 'INSERT',
      required: true,
      inputName: `add-element-name-input-${data.elementName}`,
    },
  ];

  const formCategoryInputs = [
    {
      label: 'Category Name',
      type: 'text',
      fieldKeyName: 'categoryName',
      placeholder: 'INSERT',
      required: true,
      inputName: `add-category-name-input-${data.categoryName || Math.random() * 1000}`,
    },
  ];

  const defaultFormValuesForElements = {
    categoryName: data.elementCategory,
    elementName: data.elementName,
  };

  const defaultFormValuesForCategories = {
    categoryName: data.categoryName,
  };

  const editElement = async (newElement: any) => {
    try {
      warningMessageToast('Please wait, element is being updated...');
      const scenes = await scenesToEditWithElement();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.elements = updatedScene.elements.filter((el: any) => el.elementName !== data.elementName).concat(newElement);

        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      setTimeout(() => {
        successMessageSceneToast(`${data.elementName ? data.elementName.toUpperCase() : 'NO NAME'} was successfully updated!`);
      }, 600);
    } catch (error) {
      errorToast('Error updating element');
    }
  };

  const deleteElement = async () => {
    try {
      warningMessageToast('Please wait, element is being deleted...');
      const scenes = await scenesToEditWithElement();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.elements = updatedScene.elements.filter((el: any) => el.elementName !== data.elementName);
        updatedScenes.push(updatedScene);
      });

      await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      setTimeout(() => {
        successMessageSceneToast(`${data.elementName ? data.elementName.toUpperCase() : 'NO NAME'} was successfully deleted from all scenes!`);
      });
    } catch (error) {
      errorToast('Error deleting element');
    }
  };

  const deleteCategory = async () => {
    try {
      warningMessageToast('Please wait, category is being deleted...');
      const scenes = await scenesToEditWithCategory();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        updatedScene.elements = updatedScene.elements.filter((el: any) => el.categoryName !== data.categoryName);

        updatedScenes.push(updatedScene);
      });

      const result = await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      setTimeout(() => {
        successMessageSceneToast(`${data.categoryName ? data.categoryName.toUpperCase() : 'NO NAME'} was successfully deleted from all scenes!`);
      }, 600);
    } catch (error) {
      errorToast('Error deleting category');
      throw error;
    }
  };

  const editCategory = async (newCategory: any) => {
    try {
      warningMessageToast('Please wait, category is being updated...');
      const scenes = await scenesToEditWithCategory();
      const updatedScenes: any = [];

      scenes?.forEach((scene: any) => {
        const updatedScene = { ...scene._data };

        const newElements: any[] = [];

        updatedScene.elements.forEach((el: any) => {
          const newElement = { ...el };
          if (el.categoryName === data.categoryName) {
            newElement.categoryName = newCategory.categoryName;
          }
          newElements.push(newElement);
        });

        updatedScene.elements = newElements;

        updatedScenes.push(updatedScene);
      });

      await oneWrapDb?.scenes.bulkUpsert(updatedScenes);

      setTimeout(() => {
        successMessageSceneToast(`${data.categoryName ? data.categoryName.toUpperCase() : 'NO NAME'} was successfully updated!`);
      }, 600);
    } catch (error: any) {
      errorToast(error || 'Error updating category');
      throw error;
    }
  };

  const validateExistence = (name: string) => {
    if (section === 'category') {
      return validationFunction(name, data.categoryName);
    }

    return validationFunction(name, data.elementName);
  };

  return (
    <>
      <IonItemSliding onClick={onClick}>
        <IonItem mode="md" className="element-card ion-no-margin ion-no-padding ion-nowrap" color="tertiary">
          <div className={`${'element-card-wrapper' + ' '}${section}${section === 'category' && ' background-tertiary-dark'}`}>
            <div color="dark" className="element-card-header">
              <IonTitle className="element-card-header-title">
                <HighlightedText
                  text={elementName() || (`${data.categoryName} (${elementsQuantity})`) || ''}
                  searchTerm={searchText}
                />
              </IonTitle>
              {
              section === 'category'
              && isMobile
              && <DropDownButton open={isOpen} />
            }
              {/* {section === 'element' && (
              <p className="element-card-header-subtitle">
                {data.category ? data.category.toUpperCase() : 'NO CATEGORY'}
              </p>
            )} */}
            </div>
            <div className="element-card-content">
              <InfoLabel label="SCN." value={data.scenesQuantity} />
              <InfoLabel label="PROT." value={data.protectionQuantity} />
              <InfoLabel label="PAGES" value={integerPart} symbol={fractionPart} />
              <InfoLabel label="TIME" value={minutes} symbol={`:${seconds}`} />
              <InfoLabel label="EP" value={data.episodesQuantity} />
              <InfoLabel label="PART." value={`${data.participation}%`} />
              {
              section === 'category'
              && !isMobile
              && <DropDownButton open={isOpen} />
            }
            </div>
          </div>
        </IonItem>
        <IonItemOptions className="element-card-item-options">
          <div className="buttons-wrapper">
            <IonButton fill="clear" onClick={openEditModal} disabled={disableEditions}>
              <CiEdit className="button-icon view" />
            </IonButton>
            <IonButton fill="clear" onClick={() => (section === 'category' ? scenesToEditWithCategory()?.then((values: any) => values) : scenesToEditWithElement()?.then((values: any) => values))} disabled={disableEditions}>
              <PiProhibitLight className="button-icon ban" />
            </IonButton>
            <IonButton fill="clear" onClick={() => (section === 'category' ? openDeleteCategoryAlert() : openDeleteElementAlert())} disabled={disableEditions}>
              <PiTrashSimpleLight className="button-icon trash" />
            </IonButton>
          </div>
        </IonItemOptions>
      </IonItemSliding>
      <EditionModal
        formInputs={section === 'category' ? formCategoryInputs : formElementInputs}
        handleEdition={section === 'category' ? editCategory : editElement}
        title="Edit Element"
        defaultFormValues={section === 'category' ? defaultFormValuesForCategories : defaultFormValuesForElements}
        validate={validateExistence}
        modalRef={modalRef}
      />

      <InputAlert
        header="Delete Category"
        message={`Are you sure you want to delete ${data.categoryName ? data.categoryName.toUpperCase() : 'N/A'} category from all the scenes? This will also delete all the elements inside this category.`}
        handleOk={() => deleteCategory()}
        inputs={[]}
        ref={deleteCategoryAlert}
      />

      <InputAlert
        header="Delete Element"
        message={`Are you sure you want to delete ${data.elementName ? data.elementName.toUpperCase() : 'NO NAME'} element from all the scenes?`}
        handleOk={() => deleteElement()}
        inputs={[]}
        ref={deleteElementAlert}
      />
    </>
  );
};

export default ElementCard;
