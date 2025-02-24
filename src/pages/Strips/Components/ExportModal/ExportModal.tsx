import { useEffect, useState, useCallback } from "react";
import EditionModal, { FormInput, SelectOptionsInterface } from "../../../../Shared/Components/EditionModal/EditionModal";
import { WorkerJobNameEnum } from "../../../../Shared/types/workers.types";
import { useScene } from "../../../../hooks/useScene/useScene";
import AppLoader from "../../../../Shared/hooks/AppLoader";
import { IonContent, IonPage } from "@ionic/react";

interface ExportModalProps {
  modalIsOpen: boolean;
  setModaIsOpen: (value: boolean) => void;
  handleSubmit: (values: any) => void;
}

export enum GroupsSceneEnums {
  SHOOTING_PLAN = "shooting_plan",
  EPISODE = "episode",
  LOCATION = "location",
  SET = "set",
  YEAR = "year",
  SCRIPT_DAY = "script_day",
  INT_EXT_DETAIL = "int_ext_detail",
}

export const groupsByOptions: SelectOptionsInterface[] = [
  { label: "Shooting", value: GroupsSceneEnums.SHOOTING_PLAN },
  { label: "Episode", value: GroupsSceneEnums.EPISODE },
  { label: "Location", value: GroupsSceneEnums.LOCATION },
  { label: "Set", value: GroupsSceneEnums.SET },
  { label: "Year", value: GroupsSceneEnums.YEAR },
  { label: "Script day", value: "script_day" },
  { label: "Int/Ext", value: "int_ext_detail" },
];

const ExportModal: React.FC<ExportModalProps> = ({ modalIsOpen, setModaIsOpen, handleSubmit }) => {
  const {
    uniqueSets,
    uniqueLocations,
    uniqueElements,
    uniqueElementsCategories,
    uniqueCharacters,
    uniqueCharactersCategories,
    isFetching
  } = useScene();

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [modalInputs, setModalInputs] = useState<FormInput[]>([]);

  const filtersBy: SelectOptionsInterface[] = [
    { label: "Location", value: "proj_location_id" },
    { label: "Set", value: "proj_set_id" },
    { label: "Cast category", value: "cast_category_id" },
    { label: "Cast", value: "proj_cast_id" },
    { label: "Element category", value: "element_category_id" },
    { label: "Element", value: "proj_element_id" },
  ];

  const getListOptions = useCallback((filterValue: string): SelectOptionsInterface[] => {
    switch (filterValue) {
      case "proj_location_id":
        return uniqueLocations.map(location => ({
          label: location || "NO LOCATION",
          value: location || "NO LOCATION"
        }));
      case "proj_set_id":
        console.log(uniqueSets, '?????????')
        return uniqueSets.map(set => ({
          label: set || "NO SET",
          value: set || "NO SET"
        }));
      case "proj_element_id":
        return uniqueElements.map(element => ({
          label: element?.elementName || "NO ELEMENT",
          value: element?.elementName || "NO ELEMENT"
        }));
      case "element_category_id":
        return uniqueElementsCategories.map(element => ({
          label: element?.categoryName || "NO CATEGORY",
          value: element?.categoryName || "NO CATEGORY"
        }));
      case "proj_cast_id":
        return uniqueCharacters.map(character => ({
          label: character?.characterName || "NO CHARACTER",
          value: character?.characterName || "NO CHARACTER"
        }));
      case "cast_category_id":
        return uniqueCharactersCategories.map(character => ({
          label: character?.categoryName || "NO CATEGORY",
          value: character?.categoryName || "NO CATEGORY"
        }));
      default:
        return [];
    }
  }, [
    uniqueLocations,
    uniqueSets,
    uniqueElements,
    uniqueElementsCategories,
    uniqueCharacters,
    uniqueCharactersCategories,
    selectedFilter
  ]);

  const selectTypeInput: FormInput[] = [
    {
      type: "select",
      fieldKeyName: "type",
      label: "Type",
      selectOptions: [
        { label: "Scene", value: WorkerJobNameEnum.Scene },
        { label: "Break Down", value: WorkerJobNameEnum.BreakDownScene },
      ],
      col: "12",
      required: true,
      placeholder: "SELECT EXPORT TYPE",
      onValueChanges: (value) => setSelectedOption(value),
      multiple: false,
    }
  ];

  const breakDownInputs: FormInput[] = [
    {
      type: "select",
      fieldKeyName: "groupBy",
      label: "Group By",
      selectOptions: groupsByOptions,
      col: "12",
      placeholder: "SELECT GROUP BY",
      multiple: false,
    },
    {
      type: "select",
      fieldKeyName: "filterBy",
      label: "Filter By",
      selectOptions: filtersBy,
      col: "12",
      placeholder: "SELECT FILTER BY",
      onValueChanges: (value) => setSelectedFilter(value),
      multiple: false
    }
  ];

  // Update inputs when type changes
  useEffect(() => {
    if (selectedOption === WorkerJobNameEnum.BreakDownScene) {
      const newInputs = [...selectTypeInput, ...breakDownInputs];
      if (selectedFilter) {
        const listOptions = getListOptions(selectedFilter);
        const listInput: FormInput[] = [{
          type: "select",
          fieldKeyName: "filterNames",
          label: "List",
          selectOptions: listOptions,
          col: "12",
          placeholder: "SELECT LIST",
          multiple: true,
        }];
        newInputs.push(...listInput);
      }
      setModalInputs(newInputs);
    } else {
      setModalInputs([...selectTypeInput]);
    }
  }, [selectedOption, selectedFilter, getListOptions]);

  const handleModalClose = () => {
    setSelectedOption("");
    setSelectedFilter("");
    setModalInputs([...selectTypeInput]);
    setModaIsOpen(false);
  };

  if(isFetching) return (
    <IonPage>
      <IonContent>
        <AppLoader />
      </IonContent>
    </IonPage>
  );

  return (
    <EditionModal
      title="Export Scenes"
      formInputs={modalInputs}
      handleEdition={(values: any) => handleSubmit(values)}
      isOpen={modalIsOpen}
      setIsOpen={handleModalClose}
    />
  );
};

export default ExportModal;