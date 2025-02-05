import { InfoType } from "../../../../Shared/ennums/ennums";
import InputItem from "../../../AddScene/Components/AddSceneFormInputs/InputItem";
import { Control, UseFormWatch } from "react-hook-form";
import './SceneInfoLabels.scss'
import AddPagesForm from "../../../AddScene/Components/AddSceneFormInputs/AddPagesForm";
import AddSecondsForm from "../../../AddScene/Components/AddSceneFormInputs/AddSecondsForm";
import SelectItem from "../../../AddScene/Components/AddSceneFormInputs/SelectItem";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
interface SceneInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
  type?: InfoType;
  editMode?: boolean;
  control?: Control<any>;
  setValue: (field: keyof SceneDocType, value: any) => void;
  validator?: any;
  fieldKeyName?: string;
  isEditable?: boolean;
  watch?: UseFormWatch<SceneDocType>;
  selectOptions?: any[];
  disabled?: boolean;
}

const SceneInfoLabels: React.FC<SceneInfoLabelsProps> = ({ info, title, symbol, type, editMode, control, setValue, validator, fieldKeyName, isEditable,  watch, selectOptions, disabled }) => {

  const handleChange = (value: any, field: any) => {
    setValue(field, value);
  }
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
              handleChange={handleChange}
              observedField={typeof watch(fieldKeyName as keyof SceneDocType) === 'number' ? watch(fieldKeyName as keyof SceneDocType) as number : 0}
              labels={false}
            />
          </div>
        )
      } else {
        return (<></>)
      }

      case InfoType.Select:
        return (
          <SelectItem
            detailsEditMode={true}
            label="INT/EXT"
            options={selectOptions || []}
            inputName={`add-${title}-input`}
            fieldKeyName={fieldKeyName || ''}
            control={control}
            setValue={setValue}
            watchValue={watch}
            showLabel={false}
            className="custom-select"
            disabled={disabled}
          />
        )
      case InfoType.LongText:
        return (
          <InputItem
            label={''}
            control={control}
            fieldKeyName={fieldKeyName || ''}
            placeholder="INSERT"
            setValue={setValue}
            inputName={`textarea-input`}
            validate={validator}
            className="textarea-input"
            textArea={true}
          />
        )

      case InfoType.Pages:

      return (
        <div className="custom-pages-input">
          <AddPagesForm
            handleChange={setValue}
            observedField={watch && fieldKeyName ? Number(watch(fieldKeyName as keyof SceneDocType)) || null : null}
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
    <div className="ion-flex-column labels-wrapper" style={{ textAlign: 'center', height: '100%', justifyContent: 'center' }}>
      <div>{(editMode && isEditable) ? renderInput() : renderInfo()}</div>
      <p style={{ fontSize: '8px', margin: '6px' }}>{title.toUpperCase()} {type == InfoType.Minutes &&'(MM:SS)'}</p>
    </div>
  );
}

export default SceneInfoLabels;
