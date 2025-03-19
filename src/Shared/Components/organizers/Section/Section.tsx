import React, { CSSProperties } from 'react';
import { IonButton, IonCol, IonGrid, IonItem, IonRow } from '@ionic/react';
import { VscEdit, VscSave } from 'react-icons/vsc';
import AddButton from '../../buttons/AddButton/AddButton';
import DropDownButton from '../../buttons/DropDownButton/DropDownButton';
import InfoLabel from '../../descriptive/InfoLabel/InfoLabel';

export type SectionTotal = {
  name: string;
  value: number | string;
  symbol?: string;
}

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
  totals?: SectionTotal[]
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
  color = 'dark',
  totals = []
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
    backgroundColor: `var(--ion-color-${color})`,
    color: `var(--ion-color-${color}-contrast)`,
    minHeight: '40px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden'
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
        style={sectionStyle}
        onClick={() => setOpen && setOpen(!open)}
        onTouchStart={setTouchStartStyles}
        onMouseDown={setTouchStartStyles}
        onTouchEnd={onTouchEndStyles}
        onMouseUp={onTouchEndStyles}
        className='ion-padding-start ion-padding-end'
      >
        <p className='ion-no-margin ion-flex  ion-align-items-center' style={{ fontSize: '14px', width: '30%', height: '100%' }}><b>{title.toUpperCase()}</b></p>
        {totals?.length > 0 && !editMode && (
          <IonGrid style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IonRow>
              {totals.map((total, index) => (
                <IonCol key={index} color="none" className='ion-padding-start'>
                  <InfoLabel label={total.name} value={total.value} symbol={total?.symbol} />
                </IonCol>
              ))}
              {setOpen &&
                <IonCol size="1" style={{ textAlign: 'right' }}>
                  <DropDownButton open={open} />
                </IonCol>
              }
            </IonRow>
          </IonGrid>
        )}
        {
          totals.length === 0 && (
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
              {permissionType == 1 && <AddButton onClick={onAddClick} />}
              {setOpen && totals.length > 0 && <DropDownButton open={open} />}
            </div>)
        }
      </div>
      <div className="children-wrapper">
        {open && children}
      </div>
    </>
  );
};
