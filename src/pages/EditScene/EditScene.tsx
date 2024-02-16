import { IonContent } from '@ionic/react';
import { useRef } from 'react';
import AddScenesForm from '../../components/AddScene/AddSceneForm';
import useHideTabs from '../../hooks/useHideTabs';
import SecondaryPagesLayout from '../../Layouts/SecondaryPagesLayout/SecondaryPagesLayout';
import { useHistory, useParams } from 'react-router';

const EditScene: React.FC = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);

  useHideTabs();

  const scrollToTop = () => {
    contentRef.current?.scrollToTop();
  };

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const handleConfirm = () => history.push(`/my/projects/${id}/strips`);

  return (
    <SecondaryPagesLayout resetSelections={handleConfirm} pageTitle="Add Scene" handleConfirm={handleConfirm}>
      <IonContent color="tertiary" ref={contentRef}>
        <AddScenesForm scrollToTop={() => scrollToTop()} editMode= {true}/>
      </IonContent>
    </SecondaryPagesLayout>
  );
};

export default EditScene;