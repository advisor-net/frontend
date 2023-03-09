import {
  Button,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import NumberInputFormComponent from '../components/forms/NumberInputFormComponent';

import GridSectionSubHeading from './GridSectionSubHeading';

import { FIELD_KEYS, FIELD_TOOLTIPS } from './constants';

import ControlledFormFieldValue from './ControlledFormFieldValue';

const priceSchema = Yup.number()
  .required('Required')
  .moreThan(-0.001, 'Must be greater than or equal to zero');

const NetWorthSchema = Yup.object().shape({
  [FIELD_KEYS.ASSETS_SAVINGS]: priceSchema,
  [FIELD_KEYS.ASSETS_PROPERTY]: priceSchema,
  [FIELD_KEYS.ASSETS_MISC]: priceSchema,
  [FIELD_KEYS.LIA_LOANS]: priceSchema,
  [FIELD_KEYS.LIA_CREDIT_CARD]: priceSchema,
  [FIELD_KEYS.LIA_MISC]: priceSchema,
});

const getInitialValues = ({ user, fieldKeys }) => {
  const out = {};
  for (const fieldKey of fieldKeys) {
    const value = user[fieldKey];
    out[fieldKey] = value === null ? '' : value;
  }
  return out;
};

export const APPLICABLE_FIELD_KEYS = [
  FIELD_KEYS.ASSETS_SAVINGS,
  FIELD_KEYS.ASSETS_PROPERTY,
  FIELD_KEYS.ASSETS_MISC,
  FIELD_KEYS.LIA_LOANS,
  FIELD_KEYS.LIA_CREDIT_CARD,
  FIELD_KEYS.LIA_MISC,
];

const EditNetWorthModal = ({ isOpen, onClose, onUpdate, user, requiresOnboarding }) => {
  const onSubmit = async (values) => {
    await onUpdate(values, onClose);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      closeOnEsc={!requiresOnboarding}
      closeOnOverlayClick={!requiresOnboarding}
    >
      <ModalOverlay />
      <Formik
        initialValues={getInitialValues({
          user,
          fieldKeys: APPLICABLE_FIELD_KEYS,
        })}
        validationSchema={NetWorthSchema}
        validateOnMount
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {({ handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>
                {requiresOnboarding ? 'Set up net worth' : 'Edit net worth'}
              </ModalHeader>
              {!requiresOnboarding && <ModalCloseButton />}
              <ModalBody>
                <Flex direction="column">
                  {requiresOnboarding && (
                    <Text marginBottom={4}>{FIELD_TOOLTIPS[FIELD_KEYS.NET_WORTH]}</Text>
                  )}
                  <Grid gap={4}>
                    <GridItem>
                      <GridSectionSubHeading title="Assets" tooltipInfo={FIELD_TOOLTIPS.assets} />
                      <Grid gap={4} templateColumns="repeat(3, 1fr)">
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.ASSETS_SAVINGS}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm', autoFocus: 'autofocus' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.ASSETS_PROPERTY}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.ASSETS_MISC}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                      </Grid>
                    </GridItem>
                    <GridItem>
                      <GridSectionSubHeading
                        title="Liabilities"
                        tooltipInfo={FIELD_TOOLTIPS.liabilities}
                      />
                      <Grid gap={4} templateColumns="repeat(3, 1fr)">
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.LIA_LOANS}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.LIA_CREDIT_CARD}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.LIA_MISC}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                      </Grid>
                    </GridItem>
                  </Grid>
                </Flex>
              </ModalBody>
              <ModalFooter>
                {!requiresOnboarding && (
                  <Button colorScheme="teal" variant="outline" onClick={onClose} marginRight={2}>
                    Cancel
                  </Button>
                )}
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  formNoValidate
                >
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

export default EditNetWorthModal;
