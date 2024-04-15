import React, { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

interface DropdownOptionProps {
  option: string;
  isChecked: boolean;
  onChange: () => void;
}

interface DropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onOptionChange: (newSelectedOptions: string[]) => void;
}

const DropdownOption: React.FC<DropdownOptionProps> = ({
  option,
  isChecked,
  onChange,
}) => {
  return (
    <label className="block">
      <input
        type="checkbox"
        value={option}
        checked={isChecked}
        onChange={onChange}
        className="mr-2 leading-tight"
      />
      {option}
    </label>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedOptions,
  onOptionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions, option];

    onOptionChange(newSelectedOptions);
  };

  return (
    <>
      <div className="dropdown">
        <button
          onClick={handleToggle}
          className="dropdown-toggle bg-white hover:bg-gray-100 font-medium py-2 px-4 border border-gray-400 rounded shadow"
        >
          {label}
        </button>
        {isOpen && (
          <div className="dropdown-menu mt-2 ml-5">
            {options.map((option) => (
              <>
                <DropdownOption
                  key={option}
                  option={option}
                  isChecked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
              </>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const MultiSelectDropdown: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string[];
  }>({
    SSA: [],
    Vulnerability: [],
    Gender: [],
    PhoneType: [],
    BankedStatus: [],
    BankName: [],
    Location: [],
  });

  const handleOptionChange = (field: string, newSelectedOptions: string[]) => {
    setSelectedOptions({ ...selectedOptions, [field]: newSelectedOptions });
  };

  return (
    <>
      <div className="multiselect-dropdown">
        <div className="mb-4">
          <Dropdown
            label="SSA"
            options={['Old Citizen', 'Widowed', 'Childern under 5 (Dalit)']}
            selectedOptions={selectedOptions['SSA']}
            onOptionChange={(newSelectedOptions) =>
              handleOptionChange('SSA', newSelectedOptions)
            }
          />
        </div>
        <div className="mb-4">
          <Dropdown
            label="Vulnerability"
            options={['Pregnant', 'Lactating']}
            selectedOptions={selectedOptions['Vulnerability']}
            onOptionChange={(newSelectedOptions) =>
              handleOptionChange('Vulnerability', newSelectedOptions)
            }
          />
        </div>
        <div className="mb-4">
          <Dropdown
            label="Gender"
            options={['Male', 'Female', 'Other']}
            selectedOptions={selectedOptions['Gender']}
            onOptionChange={(newSelectedOptions) =>
              handleOptionChange('Gender', newSelectedOptions)
            }
          />
        </div>
        <div className="mb-4">
          <Dropdown
            label="Phone Type"
            options={['Mobile', 'Landline', 'Feature Phone', 'Smartphone']}
            selectedOptions={selectedOptions['PhoneType']}
            onOptionChange={(newSelectedOptions) =>
              handleOptionChange('PhoneType', newSelectedOptions)
            }
          />
        </div>
        <div className="mb-4">
          <Dropdown
            label="Banked Status"
            options={['Banked', 'Unbanked', 'Underbanked']}
            selectedOptions={selectedOptions['BankedStatus']}
            onOptionChange={(newSelectedOptions) =>
              handleOptionChange('BankedStatus', newSelectedOptions)
            }
          />
        </div>
        <div className="mb-4">
          <Dropdown
            label="Bank Name"
            options={['Global IME Bank', 'Nabil Bank']}
            selectedOptions={selectedOptions['BankName']}
            onOptionChange={(newSelectedOptions) =>
              handleOptionChange('BankName', newSelectedOptions)
            }
          />
        </div>
        <div className="mb-4">
          <Dropdown
            label="Location"
            options={['Morang', 'Kathmandu', 'Chitwan', 'Pokhara']}
            selectedOptions={selectedOptions['Location']}
            onOptionChange={(newSelectedOptions) =>
              handleOptionChange('Location', newSelectedOptions)
            }
          />
        </div>
      </div>
      <div className="absolute bottom-4 right-4 mt-4">
        <Button>Submit</Button>
      </div>
    </>
  );
};
