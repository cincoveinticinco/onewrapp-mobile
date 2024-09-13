import { IonButton } from '@ionic/react';
import { VscEdit, VscSave } from 'react-icons/vsc';
import AddButton from '../AddButton/AddButton';

interface SectionProps {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode?: boolean;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: () => void;
  children: React.ReactNode;
  saveAfterEdit?: boolean
  saveFunction?: () => void
  permissionType?: number | null
}

export const Section: React.FC<SectionProps> = ({
  title,
  open,
  setOpen,
  editMode,
  setEditMode,
  onAddClick,
  children,
  saveAfterEdit = false,
  saveFunction,
  permissionType,
}) => {
  const renderEditSaveButton = () => {
    if (saveFunction && setEditMode) {
      if (editMode) {
        return (
          <VscSave
            className="toolbar-icon"
            style={{ color: 'var(--ion-color-primary)' }}
            onClick={saveFunction}
          />
        );
      }
        <VscEdit
          className="toolbar-icon"
          style={{ color: 'var(--ion-color-light)' }}
          onClick={() => setEditMode(!editMode)}
        />;
    }
    return null;
  };

  return (
    <>
      <div
        className="ion-flex ion-justify-content-between ion-padding-start ion-align-items-center"
        style={{
          border: '1px solid black',
          backgroundColor: 'var(--ion-color-dark)',
          height: '40px',
        }}
      >
        <p style={{ fontSize: '18px' }}><b>{title.toUpperCase()}</b></p>
        <div onClick={(e) => e.stopPropagation()}>
          {editMode !== undefined && setEditMode && (
            <IonButton
              fill="clear"
              slot="end"
              color="light"
              className="toolbar-button"
              disabled={permissionType !== 1}
            >
              {
              !saveAfterEdit ? (
                <VscEdit
                  className="toolbar-icon"
                  style={editMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
                  onClick={() => setEditMode && setEditMode(!editMode)}
                />
              ) : (
                <>
                  {renderEditSaveButton()}
                </>
              )
             }
            </IonButton>
          )}
          <AddButton onClick={onAddClick} disabled={permissionType !== 1} />
        </div>
      </div>
      <div className="children-wrapper">
        {open && children}
      </div>
    </>
  );
};
