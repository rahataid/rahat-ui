import { FieldType } from '../constants/fieldDefinition.const';
import { humanizeString } from '../utils';
import { MultiSelect } from './MultiSelect';

export default function Index({ formField }: any) {
  return (
    <>
      {formField.fieldType === FieldType.TEXT ||
        formField.fieldType === FieldType.NUMBER ||
        formField.fieldType === FieldType.TEXTAREA ||
        formField.fieldType === FieldType.DATE ||
        (formField.fieldType === FieldType.PASSWORD && '')}

      <MultiSelect
        placeholder={humanizeString(formField.name)}
        options={formField?.fieldPopulate?.data || []}
        fieldName={formField.name}
      />
    </>
  );
}
