'use client';
import Select, { StylesConfig } from "react-select";
import makeAnimated from 'react-select/animated';
import { useState } from "react";


const customStyles: StylesConfig<OptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: state.isFocused ? 'blue' : 'gray',
    boxShadow: state.isFocused ? '0 0 0 1px blue' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'blue' : 'gray',
    },
    padding: '0.5rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'lightgray' : 'white',
    color: 'black',
    padding: '0.5rem',
  }),
  menu: (provided) => ({
    ...provided,
    padding: '0.5rem',
  }),
};


interface OptionType {
  value: string;
  label: string;
}

type SelectorProps = {
  options: OptionType[]
  setInputValue: (value: string) => void
}

const animatedComponents = makeAnimated();

const Selector = ({ options, setInputValue }: SelectorProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const handleInputChange = (value: string) => {

    if (value.length >= 3) {
      setMenuIsOpen(true);
    } else {
      setMenuIsOpen(false);
    }
  };


  return <Select
    options={options}
    components={animatedComponents}
    styles={customStyles}
    onInputChange={handleInputChange}
    menuIsOpen={menuIsOpen}
    placeholder="Entre 3 lettres pour rechercher un item"
    onChange={(selectedOptions) => {
      if (selectedOptions === null) {
        setInputValue('');
      } else {
        setInputValue(selectedOptions.value)
      }
    }}
  />

}

export default Selector;