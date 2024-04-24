import React from 'react';
import TextInput from './TextInput';
import { FORM_FIELD } from '../constants/fieldDefinition.const';
import NumberInput from './NumberInput';
import TextAreaInput from './TextAreaInput';
import PasswordInput from './PasswordInput';
import RadioInput from './RadioInput';
import DropDownInput from './DropdownInput';
import CheckboxInput from './CheckboxInput';

export default function Index({ formField }: any) {
  return (
    <>
      {formField.fieldType === FORM_FIELD.TEXT && (
        <TextInput formField={formField} className="mt-8" />
      )}

      {formField.fieldType === FORM_FIELD.NUMBER && (
        <NumberInput formField={formField} className="mt-8" />
      )}

      {formField.fieldType === FORM_FIELD.PASSWORD && (
        <PasswordInput formField={formField} className="mt-8" />
      )}

      {formField.fieldType === FORM_FIELD.RADIO && (
        <RadioInput formField={formField} className="mt-8" />
      )}

      {formField.fieldType === FORM_FIELD.DROPDOWN && (
        <DropDownInput formField={formField} className="mt-8" />
      )}

      {formField.fieldType === FORM_FIELD.CHECKBOX && (
        <CheckboxInput formField={formField} className="mt-8" />
      )}

      {formField.fieldType === FORM_FIELD.TEXTAREA && (
        <TextAreaInput formField={formField} className="mt-8" />
      )}
    </>
  );
}
