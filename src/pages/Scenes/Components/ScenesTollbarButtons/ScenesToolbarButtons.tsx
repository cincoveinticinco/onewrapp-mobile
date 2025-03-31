import { IonIcon } from "@ionic/react";
import ToolbarButton from "../../../../Shared/Components/buttons/ToolbarButton/ToolbarButton";
import ExportButton from "../ExportButton/ExportButton";
import { addOutline, funnelOutline, settingsOutline, swapVerticalOutline } from "ionicons/icons";
import { useParams } from "react-router";

const ScenesToolbarButtons: React.FC<{
  setOpenGroupBy: (open: boolean) => void;
  disableEditions: boolean;
}> = ({ setOpenGroupBy, disableEditions }) => {
  const {id} = useParams<{id: string}>();

  return (
    <>
      <ToolbarButton
        triggerId='add-scene-button'
        click={() => {}}
        show={!disableEditions}
        color="light"
        routerLink="addscene"
      >
        <IonIcon icon={addOutline} className="toolbar-add-icon toolbar-icon" />
      </ToolbarButton>


      <ToolbarButton
        triggerId='filter-scenes-button'
        click={() => {}}
        show={true}
        color="light"
        routerLink={`/my/projects/${id}/strips/filters`}

      >
        <IonIcon icon={funnelOutline}/>
      </ToolbarButton>

      <ToolbarButton
        triggerId='sort-scenes-modal-trigger'
        click={() => {}}
        show={true}
        color="light"
      >
        <IonIcon icon={swapVerticalOutline} />
      </ToolbarButton>

      <ToolbarButton
        triggerId='group-by-modal-trigger'
        click={() => setOpenGroupBy(true)}
        show={true}
        color="light"
      >
        <IonIcon icon={settingsOutline} />
      </ToolbarButton>

      <ExportButton />
    </>
  );
};

export default ScenesToolbarButtons