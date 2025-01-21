import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useState, useCallback, useEffect } from 'react';
import './CustomSelect.scss';

interface CustomSelectProps {
  input: {
    fieldKeyName: string;
    label: string;
    placeholder: string;
    selectOptions: SelectOption[];
    value?: any;
  };
  setNewOptionValue: (fieldKeyName: string, value: any) => void;
  enableSearch?: boolean;
}

interface SelectOption {
  value: any;
  label: any;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ input, setNewOptionValue, enableSearch = false }) => {
  // Eliminamos el estado local de options y usamos directamente input.selectOptions
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  // Este efecto se ejecuta cuando cambian las opciones o el valor
  useEffect(() => {
    if (input.value) {
      const currentOption = input.selectOptions.find((opt) => opt.value === input.value);
      setSelectedOption(currentOption || null);
      if (currentOption) {
        setInputValue(currentOption.label);
      }
    } else {
      // Si no hay valor seleccionado, reseteamos el estado
      setSelectedOption(null);
      setInputValue('');
    }
  }, [input.selectOptions, input.value]);

  const handleChange = useCallback((newValue: any) => {
    console.log('executing handleChange with value:', newValue);
    setNewOptionValue(input.fieldKeyName, newValue);
  }, [input.fieldKeyName, setNewOptionValue]);

  if (!enableSearch) {
    return (
      <FormControl fullWidth variant="standard">
        <InputLabel id={`${input.fieldKeyName}-label`}>{input.label}</InputLabel>
        <Select
          labelId={`${input.fieldKeyName}-label`}
          value={input.value ?? ''}
          label={input.label}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={input.placeholder}
          MenuProps={{
            disablePortal: true,
            disableScrollLock: true,
          }}
        >
          {input.selectOptions.map((option: SelectOption) => (
            <MenuItem
              key={`${input.fieldKeyName}-${option.value}`}
              value={option.value}
            >
              {option.label.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <Autocomplete
      options={input.selectOptions}
      getOptionLabel={(option: string | SelectOption) => 
        typeof option === 'string' ? option : option.label
      }
      renderOption={(props, option: string | SelectOption) => {
        const { key, ...otherProps } = props;
        return (
          <li
            key={key}
            {...otherProps}
          >
            {typeof option === 'string' ? option : option.label.toUpperCase()}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={input.label}
          placeholder={input.placeholder}
          variant="standard"
          fullWidth
        />
      )}
      value={selectedOption}
      onChange={(_, value: string | SelectOption | null) => {
        console.log('Autocomplete onChange:', value);
        if (typeof value === 'string') {
          setSelectedOption(null);
          handleChange(null);
          setInputValue(value);
        } else {
          setSelectedOption(value);
          if (value) {
            handleChange(value.value);
            setInputValue(value.label);
          } else {
            handleChange(null);
            setInputValue('');
          }
        }
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue, reason) => {
        console.log('onInputChange:', newInputValue, reason);
        setInputValue(newInputValue);
        if (reason === 'input') {
          setSelectedOption(null);
        }
      }}
      selectOnFocus
      clearOnBlur={false}
      handleHomeEndKeys
      fullWidth
      disablePortal
      isOptionEqualToValue={(option, value) => {
        // Implementación personalizada de comparación de opciones
        if (!option || !value) return false;
        return typeof option !== 'string' && typeof value !== 'string' && option.value === value.value;
      }}
    />
  );
};

export default CustomSelect;