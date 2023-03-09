import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';

const NumberInputFormComponent = (props) => {
  const { autoFocus } = props;
  return (
    <NumberInput {...props}>
      {autoFocus ? <NumberInputField autoFocus={autoFocus} /> : <NumberInputField />}
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default NumberInputFormComponent;
