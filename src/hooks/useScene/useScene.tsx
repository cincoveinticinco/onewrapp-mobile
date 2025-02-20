import { useHistory } from 'react-router-dom';
import useSuccessToast from '../../Shared/hooks/useSuccessToast';
import { useRxDB } from 'rxdb-hooks';
import useErrorToast from '../../Shared/hooks/useErrorToast';


export const useScene = () => {
  const history = useHistory();
  const oneWrapDb: any = useRxDB();
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  const deleteScene = async (sceneId: string, projectId: string) => {
    try {
      const sceneToDelete = await oneWrapDb?.scenes.findOne({ 
        selector: { sceneId: parseInt(sceneId) } 
      }).exec();
      
      await sceneToDelete?.remove();
      history.push(`/my/projects/${projectId}/strips`);
      successToast('Scene deleted successfully');
    } catch (error) {
      errorToast('Error deleting scene');
    }
  };

  return {
    deleteScene,
  };
};