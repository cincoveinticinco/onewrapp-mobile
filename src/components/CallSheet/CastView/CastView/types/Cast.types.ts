export interface CastViewProps {
  castData: any[];
  addNewModalIsOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editMode: boolean;
  addNewCastCall: (formData: any) => Promise<void>;
  castOptions: { value: any; label: string }[];
  editCastCall: (index: number, key: any, newValue: any, type: string) => void
  permissionType?: number | null
  searchText?: string
}