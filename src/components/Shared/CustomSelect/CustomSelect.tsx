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
  const [options, setOptions] = useState<SelectOption[]>(input.selectOptions);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  // Initialize selected option when component mounts or input.value changes
  useEffect(() => {
    const currentOption = options.find((opt) => opt.value === input.value);
    setSelectedOption(currentOption || null);
    if (currentOption) {
      setInputValue(currentOption.label);
    }
  }, [input.value, options]);

  // Memorized change handler
  const handleChange = useCallback((newValue: any) => {
    setNewOptionValue(input.fieldKeyName, newValue);
  }, [input.fieldKeyName, setNewOptionValue]);

  // Regular select without search
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
          {options.map((option: SelectOption) => (
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

  // Function to handle creating a new option
  const handleCreateOption = (inputValue: string) => {
    const newOption: SelectOption = {
      value: inputValue,
      label: inputValue,
    };
    setOptions((prev) => [...prev, newOption]);
    setSelectedOption(newOption);
    handleChange(newOption.value);
    setInputValue(newOption.label);
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option: string | SelectOption) => typeof option === 'string' ? option : option.label}
      renderOption={(props, option: string | SelectOption) => (
        <li
          {...props}
          style={{
            color: typeof option === 'string' ? 'inherit' : option.value,
          }}
        >
          {typeof option === 'string' ? option : option.label.toUpperCase()}
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
      value={selectedOption}
      onChange={(event: React.SyntheticEvent<Element, Event>, value: string | SelectOption | null, reason: any) => {
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
      onInputChange={(event, newInputValue, reason) => {
        setInputValue(newInputValue);
        // Only clear selected option if the user is actively typing
        if (reason === 'input') {
          setSelectedOption(null);
        }
      }}
      freeSolo
      selectOnFocus
      clearOnBlur={false}  // Changed to false to maintain value
      handleHomeEndKeys
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' && 
          inputValue && 
          !options.some(option => 
            option.label.toLowerCase() === inputValue.toLowerCase()
          )
        ) {
          handleCreateOption(inputValue);
          event.preventDefault();
        }
      }}
      onBlur={() => {
        // If there's input value but no selection, create new option
        if (
          inputValue && 
          !selectedOption && 
          !options.some(option => 
            option.label.toLowerCase() === inputValue.toLowerCase()
          )
        ) {
          handleCreateOption(inputValue);
        } else if (!inputValue && selectedOption) {
          // If input is cleared but there was a selection, restore the selection
          setInputValue(selectedOption.label);
        }
      }}
      fullWidth
      disablePortal
      componentsProps={{
        popper: {
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