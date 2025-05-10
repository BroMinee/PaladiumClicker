'use client';
import Select, { StylesConfig } from "react-select";
import makeAnimated from 'react-select/animated';
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { OptionType } from "@/types";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";

const customStyles: StylesConfig<OptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: state.isFocused ? 'blue' : 'gray',
    boxShadow: state.isFocused ? '0 0 0 1px blue' : 'none',
    cursor: 'text',
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


type SelectorProps = {
  options: OptionType[]
  defaultValue: OptionType | null
  setInputValue: (value: string) => void
}

const DropdownIndicator = () => null;
const IndicatorSeparator = () => null;

const animatedComponents = makeAnimated();

const Selector = ({ options, defaultValue, setInputValue }: SelectorProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (value: string) => {

    if (value.length >= 3) {
      setMenuIsOpen(true);
    } else {
      setMenuIsOpen(false);
    }
  };


  const formatOptionLabel = ({ label, label2, img }: OptionType) => (
    <div className="flex items-center">
      <Image src={`/AH_img/${img}`} alt="label" width={48} height={48} unoptimized={true}
             className="h-12 w-12 pixelated mr-2 rounded-md"/>
      <div className="flex flex-col gap-1">
        <span className="ml-2 font-bold">{label}</span>
        <span className="ml-2 text-gray-500">{label2}</span>
      </div>

    </div>
  );

  if (!isMounted) {
    return (
      <div className="flex flex-row gap-2 m-4 w-96 items-center">
        <LoadingSpinner size={4}/>
        <h2 className="font-bold">Chargement du selector...</h2>
      </div>
    );
  }

  return <Select
    options={options}
    components={{ ...animatedComponents, DropdownIndicator, IndicatorSeparator }}
    styles={customStyles}
    onInputChange={handleInputChange}
    formatOptionLabel={formatOptionLabel}
    menuIsOpen={menuIsOpen}
    placeholder="Entre 3 lettres pour rechercher un item"
    onChange={(selectedOptions) => {
      if (selectedOptions === null) {
        setInputValue('');
      } else {
        setInputValue(selectedOptions.value)
      }
    }}
    defaultValue={defaultValue}
  />

}

export default Selector;