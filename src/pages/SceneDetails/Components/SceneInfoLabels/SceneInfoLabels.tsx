import { textAlign } from "@mui/system";
import { InfoType } from "../../../../Shared/ennums/ennums";
import { isNumberValidator } from "../../../../Shared/Utils/validators";
import InputItem from "../../../AddScene/Components/AddSceneFormInputs/InputItem";
import { Control, WatchObserver } from "react-hook-form";
import './SceneInfoLabels.scss'
import AddPagesForm from "../../../AddScene/Components/AddSceneFormInputs/AddPagesForm";
import AddSecondsForm from "../../../AddScene/Components/AddSceneFormInputs/AddSecondsForm";
interface SceneInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
  type?: InfoType;
  editMode?: boolean;
  control?: Control<any>;
  setValue?: () => void;
  validator?: any;
  fieldKeyName?: string;
  isEditable?: boolean;
  watch?: WatchObserver<any>;
  handleChange?: (value: string) => void;
}

const SceneInfoLabels: React.FC<SceneInfoLabelsProps> = ({ info, title, symbol, type, editMode, control, setValue, validator, fieldKeyName, isEditable, handleChange, watch }) => {
  const renderInfo = () => {
    return (
      <p className="ion-no-margin" style={{ fontSize: '16px'}}>
        <b>{info.toUpperCase()}</b>
        <span className="symbol-part" style={{ fontSize: '14px', fontWeight: 'bold' }}>{symbol}</span>
      </p>
    )
  }

  const renderInput = () => {
    switch (type) {

      case InfoType.Date:

      case InfoType.Time:

      case InfoType.Fraction:

      case InfoType.Integer:

      case InfoType.Hours:

      case InfoType.Minutes:
      if (watch && fieldKeyName) {
        return (
          <div className="custom-pages-input">
            <AddSecondsForm
              handleChange={handleChange as (value: any, field: string) => void}
              observedField={watch(fieldKeyName || '', {}) as unknown as number}
              labels={false}
            />
          </div>
        )
      } else {
        return (<></>)
      }
      case InfoType.LongText:

      case InfoType.Pages:

      return (
        <div className="custom-pages-input">
          <AddPagesForm
            handleChange={handleChange as (value: any, field: string) => void}
            observedField={watch ? (watch(fieldKeyName || '', {}) as unknown as number) : null}
            labels={false}
          />
        </div>
      );
      default:
        return (
          <InputItem
            label={''}
            control={control}
            fieldKeyName={fieldKeyName || ''}
            placeholder="INSERT"
            setValue={setValue}
            inputName={`add-${title}-input`}
            validate={validator}
            className="custom-input"
          />
        )

    }
  }

  return (
    <div className="ion-flex-column" style={{ textAlign: 'center', height: '100%', justifyContent: 'center' }}>
      <div>{(editMode && isEditable) ? renderInput() : renderInfo()}</div>
      
      <p style={{ fontSize: '8px', margin: '6px' }}>{title.toUpperCase()} (MM:SS)</p>
    </div>
  );
}

export default SceneInfoLabels;
