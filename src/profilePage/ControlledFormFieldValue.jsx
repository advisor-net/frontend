import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import { Field } from 'formik';

import { FIELD_LABELS, FIELD_TOOLTIPS } from './constants';

const ControlledFormFieldValue = ({ fieldKey, inputComponent, inputProps = {} }) => {
  return (
    <Field id={fieldKey} name={fieldKey}>
      {({ field, form }) => (
        <FormControl isInvalid={!!form.errors[fieldKey] && form.touched[fieldKey]} isRequired>
          <FormLabel>{FIELD_LABELS[fieldKey]}</FormLabel>
          {inputComponent({
            ...field,
            onChange: (val) => form.setFieldValue(fieldKey, val),
            ...inputProps,
          })}
          {!!FIELD_TOOLTIPS[fieldKey] && <FormHelperText>{FIELD_TOOLTIPS[fieldKey]}</FormHelperText>}
          <FormErrorMessage>{form.errors[fieldKey]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

export default ControlledFormFieldValue;
