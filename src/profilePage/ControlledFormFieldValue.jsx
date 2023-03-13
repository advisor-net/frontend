import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '@chakra-ui/react';
import { Field } from 'formik';

import { FIELD_LABELS, FIELD_TOOLTIPS } from './constants';

const ControlledFormFieldValue = ({ fieldKey, inputComponent, inputProps = {} }) => {
  return (
    <Field id={fieldKey} name={fieldKey}>
      {({ field, form }) => (
        <FormControl isInvalid={!!form.errors[field.name] && form.touched[field.name]} isRequired>
          <FormLabel>{FIELD_LABELS[fieldKey]}</FormLabel>
          {inputComponent({
            ...field,
            onChange: (val) => form.setFieldValue(field.name, val),
            ...inputProps,
          })}
          {!!FIELD_TOOLTIPS[field.name] && (
            <FormHelperText>{FIELD_TOOLTIPS[field.name]}</FormHelperText>
          )}
          <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

export default ControlledFormFieldValue;
