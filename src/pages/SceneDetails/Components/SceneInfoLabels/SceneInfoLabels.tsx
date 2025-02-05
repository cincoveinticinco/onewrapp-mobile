import { InfoType } from "../../../../Shared/ennums/ennums";
import InputItem from "../../../AddScene/Components/AddSceneFormInputs/InputItem";
import { Control, UseFormWatch } from "react-hook-form";
import './SceneInfoLabels.scss'
import AddPagesForm from "../../../AddScene/Components/AddSceneFormInputs/AddPagesForm";
import AddSecondsForm from "../../../AddScene/Components/AddSceneFormInputs/AddSecondsForm";
import SelectItem from "../../../AddScene/Components/AddSceneFormInputs/SelectItem";
import { SceneDocType } from "../../../../Shared/types/scenes.types";
import { isRequiredValidator } from "../../../../Shared/Utils/validators";

export type FormType = {
  control: Control<any>;
  setValue: (field: keyof SceneDocType, value: any) => void;
  watch: UseFormWatch<SceneDocType>;
  errors: any;
  setError: any;
  clearErrors: any;
}

export type LabelType = {
  fieldKeyName: string;
  isEditable: boolean;
  disabled: boolean;
  title: string;
  symbol?: string;
  info: string;
}

export type Input = {
  type: InfoType;
  selectOptions?: any[];
  validators?: ((value: any) => boolean | string)[];
  required?: boolean;
}

interface SceneInfoLabelsProps {
  editMode?: boolean;
  label: LabelType;
  form: FormType;
  input: Input;
}

const SceneInfoLabels: React.FC<SceneInfoLabelsProps> = ({ editMode, label: { fieldKeyName, isEditable, disabled, title, symbol, info },
  form: { control, setValue, watch, errors, setError }, input: { type, selectOptions, validators, required }
 }) => {
  const generalValidator = (value: any) => {
    const effectiveValidators = required && !validators?.includes(isRequiredValidator) 
      ? [...(validators || []), isRequiredValidator]
      : validators;
  
    if (effectiveValidators && effectiveValidators.length > 0) {
      for (let validator of effectiveValidators) {
        const result = validator(value);
        if (result !== true) {
          return result;
        }
      }
    }
    return true;
  }

  const showError =  typeof generalValidator(watch(fieldKeyName as keyof SceneDocType)) === 'string';
  const currentValue = watch(fieldKeyName as keyof SceneDocType);
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
            label=""
            options={selectOptions || []}
            inputName={`add-${title}-input`}
            fieldKeyName={fieldKeyName || 'defaultKey'}
            control={control}
            setValue={setValue}
            watchValue={watch}
            showLabel={false}
            className="custom-select"
            disabled={disabled}
            validate={generalValidator}
            displayError={!!errors[fieldKeyName]}
          />
        );
      case InfoType.LongText:
        return (
          <InputItem
            label={''}
            control={control}
            fieldKeyName={fieldKeyName || ''}
            placeholder="INSERT"
            setValue={setValue}
            inputName={`textarea-input`}
            validate={generalValidator}
            className="textarea-input"
            textArea={true}
          />
        )

      case InfoType.Pages:

      return (
        <div className="custom-pages-input">
          <AddPagesForm
            handleChange={setValue}
            observedField={fieldKeyName ? Number(watch(fieldKeyName as keyof SceneDocType)) || null : null}
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
            validate={generalValidator}
            className="custom-input"
          />
        )
    }
  }

  return (
    <div className="ion-flex-column labels-wrapper" style={{ textAlign: 'center', height: '100%', justifyContent: 'center' }}>
      <div>{(editMode && isEditable) ? renderInput() : renderInfo()}</div>
      <p style={{ fontSize: '10px', margin: '6px', fontWeight: '500' }} className={showError ? 'error' : ''}>
        {!showError ? (
          <>
            {title.toUpperCase()} {type === InfoType.Minutes && '(MM:SS)'} {required ? '*' : ''}
          </>
        ) : (
          generalValidator(currentValue)
        )}
      </p>

    </div>
  );
}

export default SceneInfoLabels;
