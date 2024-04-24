import React from 'react';
import TextInput from './TextInput';
import { FieldType } from '../constants/fieldDefinition.const';
import NumberInput from './NumberInput';
import TextAreaInput from './TextAreaInput';
import PasswordInput from './PasswordInput';
import RadioInput from './RadioInput';
import DropDownInput from './DropdownInput';
import CheckboxInput from './CheckboxInput';

export default function Index({ formField }: any) {
  return (
    <>
      {formField.fieldType === FieldType.TEXT && (
        <TextInput formField={formField} />
      )}

      {formField.fieldType === FieldType.TEXT && (
        <TextInput formField={formField} />
      )}

      {formField.fieldType === FieldType.NUMBER && (
        <NumberInput formField={formField} />
      )}

      {formField.fieldType === FieldType.PASSWORD && (
        <PasswordInput formField={formField} />
      )}

      {formField.fieldType === FieldType.RADIO && (
        <RadioInput formField={formField} />
      )}

      {formField.fieldType === FieldType.DROPDOWN && (
        <DropDownInput formField={formField} />
      )}

      {formField.fieldType === FieldType.CHECKBOX && (
        <CheckboxInput formField={formField} />
      )}

      {formField.fieldType === FieldType.TEXTAREA && (
        <TextAreaInput formField={formField} />
      )}
    </>
  );
}
