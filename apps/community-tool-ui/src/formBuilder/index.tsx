import React from 'react';
import TextInput from './TextInput';
import { FORM_FIELD } from '../constants/fieldDefinition.const';
import NumberInput from './NumberInput';
import TextAreaInput from './TextAreaInput';
import PasswordInput from './PasswordInput';
import RadioInput from './RadioInput';
import DropDownInput from './DropdownInput';
import CheckboxInput from './CheckboxInput';

// interface IndexProps {
//   name: string;
//   fieldType: string;
//   fieldPopulate: any[];
// }

export default function Index({ formField }: any) {
  return (
    <>
      {formField.fieldType === FORM_FIELD.TEXT && (
        <TextInput formField={formField} />
      )}

      {formField.fieldType === FORM_FIELD.NUMBER && (
        <NumberInput formField={formField} />
      )}

      {formField.fieldType === FORM_FIELD.PASSWORD && (
        <PasswordInput formField={formField} />
      )}

      {formField.fieldType === FORM_FIELD.RADIO && (
        <RadioInput formField={formField} />
      )}

      {formField.fieldType === FORM_FIELD.DROPDOWN && (
        <DropDownInput formField={formField} />
      )}

      {formField.fieldType === FORM_FIELD.CHECKBOX && (
        <CheckboxInput formField={formField} />
      )}

      {formField.fieldType === FORM_FIELD.TEXTAREA && (
        <TextAreaInput formField={formField} />
      )}
    </>
  );
}
