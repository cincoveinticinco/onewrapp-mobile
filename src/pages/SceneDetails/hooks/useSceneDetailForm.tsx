import { useEffect } from "react";
import { SceneDocType } from "../../../Shared/types/scenes.types";
import { useForm } from "react-hook-form";

const useSceneDetailForm = () => {
  const {
    control,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
    handleSubmit,
    clearErrors
  } = useForm<SceneDocType>({
    mode: 'onChange', // Validate on every change
    reValidateMode: 'onChange',
  });
  

  return {
    control,
    reset,
    watch,
    setValue,
    setError,
    errors,
    handleSubmit,
    clearErrors
  }
}

export default useSceneDetailForm;