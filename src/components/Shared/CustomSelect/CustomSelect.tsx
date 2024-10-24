import {
  Autocomplete,
  FormControl, InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useState, useCallback } from 'react';
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
  const [inputValue, setInputValue] = useState('');

  // Memorizamos la función de cambio para evitar recreaciones innecesarias
  const handleChange = useCallback((newValue: any) => {
    setNewOptionValue(input.fieldKeyName, newValue);
  }, [input.fieldKeyName, setNewOptionValue]);

  if (!enableSearch) {
    return (
      <FormControl fullWidth variant="standard">
        <InputLabel id={`${input.fieldKeyName}-label`}>{input.label}</InputLabel>
        <Select
          labelId={`${input.fieldKeyName}-label`}
          value={input.value ?? ''} // Usamos el operador de coalescencia nula
          label={input.label}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={input.placeholder}
          MenuProps={{
            // Configuración para mejorar el manejo del foco
            disablePortal: true,
            disableScrollLock: true,
          }}
        >
          {input.selectOptions.map((option: SelectOption) => (
            <MenuItem
              key={`${input.fieldKeyName}-${option.value}`}
              value={option.value}
              style={{
                color: option.value,
              }}
            >
              {option.label.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  const currentValue = React.useMemo(() => 
    input.selectOptions.find((opt) => opt.value === input.value) || null,
    [input.value, input.selectOptions]
  );

  return (
    <Autocomplete
      options={input.selectOptions}
      getOptionLabel={(option: SelectOption) => option.label}
      renderOption={(props, option: SelectOption) => (
        <li
          {...props}
          style={{
            color: option.value,
          }}
        >
          {option.label.toUpperCase()}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={input.label}
          placeholder={input.placeholder}
          variant="standard"
          fullWidth
        />
      )}
      value={currentValue}
      onChange={(event: any, newValue: SelectOption | null) => {
        if (newValue) {
          handleChange(newValue.value);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      fullWidth
      disablePortal // Desactivamos el portal para evitar problemas de foco
      componentsProps={{
        popper: {
          // Configuración adicional para el manejo del foco
          modifiers: [{
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: false,
              rootBoundary: 'document',
            },
          }],
        },
      }}
    />
  );
};

export default CustomSelect;