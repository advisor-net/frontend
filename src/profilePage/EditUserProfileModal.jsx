import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
  GridItem,
  Text
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import NumberInputFormComponent from '../components/forms/NumberInputFormComponent';

import { FIELD_KEYS, FIELD_LABELS, FIELD_TOOLTIPS } from './constants';
import { CURRENT_PFM_LABELS, GENDER_LABELS, JOB_LEVEL_LABELS } from '../constants/all';
import GenderSelector from '../components/selectorComponents/GenderSelector';
import MetroAreaSelector from '../components/selectorComponents/MetroAreaSelector';
import CurrentPFMSelector from '../components/selectorComponents/CurrentPFMSelector';
import JobTitleSelector from '../components/selectorComponents/JobTitleSelector';
import IndustrySelector from '../components/selectorComponents/IndustrySelector';
import LevelSelector from '../components/selectorComponents/LevelSelector';

const UserProfileSchema = Yup.object().shape({
  [FIELD_KEYS.AGE]: Yup.number().required('Required').min(0, 'Must be greater than 0').max(100, 'Must be less than 100').integer('Must be integer'),
  [FIELD_KEYS.CURRENT_PFM]: Yup.mixed().required('Required'),
  [FIELD_KEYS.GENDER]: Yup.mixed().required('Required'),
  [FIELD_KEYS.INDUSTRY]: Yup.mixed().required('Required'),
  [FIELD_KEYS.JOB_TITLE]: Yup.mixed().required('Required'),
  [FIELD_KEYS.METRO]: Yup.mixed().required('Required'),
  [FIELD_KEYS.LEVEL]: Yup.mixed().required('Required'),
});

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
          <FormErrorMessage>{form.errors[fieldKey]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}

const EditUserProfileModal = ({ isOpen, onClose, onUpdate, user }) => {
  const handleSubmit = async (values) => {
    await onUpdate(values, onClose);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay/>
        <Formik
          initialValues={{
            [FIELD_KEYS.AGE]: user.age === null ? '' : user.age,
            [FIELD_KEYS.CURRENT_PFM]: user.currentPfm ? { value: user.currentPfm, label: CURRENT_PFM_LABELS[user.currentPfm] } : null,
            [FIELD_KEYS.GENDER]: user.gender ? { value: user.gender, label: GENDER_LABELS[user.gender] } : null,
            [FIELD_KEYS.INDUSTRY]: user.industry ? { value: user.industry.id, label: user.industry.name } : null,
            [FIELD_KEYS.JOB_TITLE]: user.jobTitle ? { value: user.jobTitle.id, label: user.jobTitle.name } : null,
            [FIELD_KEYS.METRO]: user.metro ? { value: user.metro.id, label: user.metro.name } : null,
            [FIELD_KEYS.LEVEL]: user.level ? { value: user.level, label: JOB_LEVEL_LABELS[user.level] } : null,
          }}
          validationSchema={UserProfileSchema}
          validateOnMount={false}
          onSubmit={async (values) => {
            await handleSubmit({
              ...values,
              currentPfm: values.currentPfm.value,
              gender: values.gender.value,
              industry: values.industry.value,
              jobTitle: values.jobTitle.value,
              metro: values.metro.value,
              level: values.level.value,
            });
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <ModalContent>
                <ModalHeader>Edit your profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex direction="column">
                    <Grid gap={4} templateColumns='repeat(2, 1fr)'>
                      <GridItem colSpan={1} rowSpan={1}>
                        <ControlledFormFieldValue
                          fieldKey={FIELD_KEYS.AGE}
                          inputComponent={NumberInputFormComponent}
                          inputProps={{ size: "sm" }}
                        />
                      </GridItem>
                      <GridItem colSpan={1} rowSpan={1}>
                        <ControlledFormFieldValue
                          fieldKey={FIELD_KEYS.GENDER}
                          inputComponent={GenderSelector}
                          inputProps={{ isMulti: false }}
                        />
                      </GridItem>
                      <GridItem colSpan={2} rowSpan={1}>
                        <ControlledFormFieldValue
                          fieldKey={FIELD_KEYS.METRO}
                          inputComponent={MetroAreaSelector}
                          inputProps={{ isMulti: false }}
                        />
                      </GridItem>
                      <GridItem colSpan={2} rowSpan={1}>
                        <ControlledFormFieldValue
                          fieldKey={FIELD_KEYS.JOB_TITLE}
                          inputComponent={JobTitleSelector}
                          inputProps={{ isMulti: false }}
                        />
                      </GridItem>
                      <GridItem colSpan={1} rowSpan={1}>
                        <ControlledFormFieldValue
                          fieldKey={FIELD_KEYS.INDUSTRY}
                          inputComponent={IndustrySelector}
                          inputProps={{ isMulti: false }}
                        />
                      </GridItem>
                      <GridItem colSpan={1} rowSpan={1}>
                        <ControlledFormFieldValue
                          fieldKey={FIELD_KEYS.LEVEL}
                          inputComponent={LevelSelector}
                          inputProps={{ isMulti: false }}
                        />
                      </GridItem>
                      <GridItem colSpan={2} rowSpan={1}>
                        <ControlledFormFieldValue
                          fieldKey={FIELD_KEYS.CURRENT_PFM}
                          inputComponent={CurrentPFMSelector}
                          inputProps={{ isMulti: false }}
                        />
                      </GridItem>
                    </Grid>
                  </Flex>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="teal" variant='ghost' onClick={onClose} marginRight={2}>Cancel</Button>
                  <Button colorScheme='teal' type="submit" isLoading={isSubmitting} formNoValidate>
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
    </Modal>
  );
};

export default EditUserProfileModal;
