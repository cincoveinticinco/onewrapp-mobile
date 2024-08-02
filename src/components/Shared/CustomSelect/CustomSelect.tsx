import React, { useState } from 'react';
import {
  Select, MenuItem, FormControl, InputLabel, Autocomplete, TextField,
} from '@mui/material';
import './CustomSelect.scss';

interface CustomSelectProps {
  input: {
    fieldKeyName: string;
    label: string;
    placeholder: string;
    selectOptions: SelectOption[];
  };
  setNewOptionValue: (fieldKeyName: string, value: any) => void;
  enableSearch?: boolean;
}

interface SelectOption {
  value: any;
  label: any;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ input, setNewOptionValue, enableSearch = false }) => {
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  if (!enableSearch) {
    // Usando Select de Material-UI
    return (
      <FormControl fullWidth variant="standard">
        <InputLabel id={`${input.fieldKeyName}-label`}>{input.label}</InputLabel>
        <Select
          labelId={`${input.fieldKeyName}-label`}
          value={value}
          label={input.label}
          onChange={(e) => {
            setValue(e.target.value as string);
            setNewOptionValue(input.fieldKeyName, e.target.value as string);
          }}
          placeholder={input.placeholder}
        >
          {input.selectOptions.map((option: SelectOption, index: number) => (
            <MenuItem
              key={index}
              value={option.value}
              style={
              {
                color: option.value,
              }
            }
            >
              {option.label.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // Si la búsqueda está habilitada, usamos el Autocomplete de Material-UI
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
      onChange={(event: any, newValue: SelectOption | null) => {
        if (newValue) {
          setValue(newValue.value);
          setNewOptionValue(input.fieldKeyName, newValue.value);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      fullWidth
    />
  );
};

export default CustomSelect;
