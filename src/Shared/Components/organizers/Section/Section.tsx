import React, { CSSProperties } from 'react';
import { IonButton, IonItem } from '@ionic/react';
import { VscEdit, VscSave } from 'react-icons/vsc';
import AddButton from '../../buttons/AddButton/AddButton';
import DropDownButton from '../../buttons/DropDownButton/DropDownButton';

interface SectionProps {
  title: string;
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  editMode?: boolean;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick?: () => void;
  children: React.ReactNode;
  saveAfterEdit?: boolean;
  saveFunction?: () => void;
  permissionType?: number | null;
  id?: string | null;
  color?: string;
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
  id,
  color = 'dark'
}) => {
  const renderEditSaveButton = () => {
    if (saveFunction && setEditMode) {
      if (editMode) {
        return (
          <>
            <IonButton
              onClick={() => {
                saveFunction();
                setEditMode(!editMode);
              }}
              fill="clear"
              className="outline-success-button-small"
            >
              SAVE
            </IonButton>
            <IonButton onClick={() => setEditMode(!editMode)} fill="clear" className="outline-danger-button-small">
              CANCEL
            </IonButton>
          </>
        );
      }
      return (
        <IonButton onClick={() => setEditMode(!editMode)} fill="clear">
          <VscEdit
            className="toolbar-icon"
            style={{ color: 'var(--ion-color-light)' }}
          />
        </IonButton>
      );
    }
    return null;
  };

  const [sectionStyle, setSectionStyle] = React.useState<CSSProperties>({
    border: '1px solid black',
    backgroundColor: `var(--ion-color-${color})`,
    color:`var(--ion-color-${color}-contrast)`,
    height: '40px',
    cursor: 'pointer',
    position: 'relative'
  });

  const setTouchStartStyles = () => {
    setSectionStyle({
      ...sectionStyle,
      backgroundColor: `var(--ion-color-${color})`,
    });
  }

  const onTouchEndStyles = () => { 
    setSectionStyle({
      ...sectionStyle,
      backgroundColor: 'var(--ion-color-dark)',
    });
  }


  return (
    <>
      <div
        id={id ?? undefined}
        className="ion-flex ion-justify-content-between ion-padding-start ion-align-items-center"
        style={sectionStyle}
        onClick={() => setOpen && setOpen(!open)}
        onTouchStart={setTouchStartStyles}
        onMouseDown={setTouchStartStyles}
        onTouchEnd={onTouchEndStyles}
        onMouseUp={onTouchEndStyles}
      >
        <p style={{ fontSize: '14px' }}><b>{title.toUpperCase()}</b></p>
        <div onClick={(e) => e.stopPropagation()}>
          {editMode !== undefined && setEditMode && (
            <>
              {!saveAfterEdit ? (
                <IonButton
                  fill="clear"
                  slot="end"
                  color="light"
                  className="toolbar-button"
                  disabled={permissionType !== 1}
                  onClick={() => setEditMode(!editMode)}
                >
                  <VscEdit
                    className="toolbar-icon"
                    style={editMode ? { color: 'var(--ion-color-primary)' } : { color: 'var(--ion-color-light)' }}
                  />
                </IonButton>
              ) : (
                renderEditSaveButton()
              )}
            </>
          )}
          {permissionType == 1 && <AddButton onClick={onAddClick}  />}
          {setOpen &&  <DropDownButton open={open} />}
        </div>
      </div>
      <div className="children-wrapper">
        {open && children}
      </div>
    </>
  );
};
