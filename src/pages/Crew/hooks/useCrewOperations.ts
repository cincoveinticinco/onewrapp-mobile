import { useRxDB } from "rxdb-hooks";
import useErrorToast from "../../../hooks/Shared/useErrorToast";
import useSuccessToast from "../../../hooks/Shared/useSuccessToast";
import { FormStructureInterface } from "../types/crew.interfaces";
import { Crew as CrewInterface } from "../../../interfaces/crew.types"; 

interface CrewOperationsInterface {
  selectedCrewId?: string | null;
  setSelectedCrewId?: (id: string | null) => void;
  setAddNewModalIsOpen?: (isOpen: boolean) => void;
  id?: string;
}

const useCrewOperations = ({
  selectedCrewId = null,
  setSelectedCrewId = (id: string | null) => {},
  setAddNewModalIsOpen = (isOpen: boolean) => {},
  id = '',
}: CrewOperationsInterface) => {
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const oneWrappDb: any = useRxDB();

    const handleUpsert = async (data: FormStructureInterface) => {
      const formattedData: CrewInterface = {
        id: selectedCrewId || data?.phone,
        fullName: data.fullName,
        positionEsp: data.position,
        positionEng: data.position,
        email: data.email,
        countryId: data.countryId,
        phone: data.phone,
        unitIds: data.unitIds.join(','),
        order: parseInt(data.order),
        visibleOnCall: data.visibleOnCall,
        visibleOnHeader: data.visibleOnHeader,
        onCall: data.onCall,
        dailyReportSignature: data.dailyReportSignature,
        emergencyContact: data.emergencyContact,
        depNameEng: data.department.toUpperCase(),
        depNameEsp: data.department.toUpperCase(),
        projectId: parseInt(id),
        updatedAt: new Date().toISOString(),
      };
  
      try {
        await oneWrappDb.crew.upsert(formattedData);
        successToast(`Crew member ${selectedCrewId ? 'updated' : 'added'} successfully`);
        setAddNewModalIsOpen(false);
        setSelectedCrewId(null);
      } catch (error) {
        errorToast(`Error ${selectedCrewId ? 'updating' : 'adding'} crew member`);
        console.error(`Error ${selectedCrewId ? 'updating' : 'adding'} crew member:`, error);
      }
    };
  
    const handleDeleteCrew = async (id: string) => {
      try {
        await oneWrappDb.crew.findOne({ selector: { id } }).remove();
        successToast('Crew member deleted successfully');
        // Optionally, you might want to update the local state or refetch the crew data
      } catch (error) {
        errorToast('Error deleting crew member');
        console.error('Error deleting crew member:', error);
      }
    };

  return { handleUpsert, handleDeleteCrew };
};

export default useCrewOperations;