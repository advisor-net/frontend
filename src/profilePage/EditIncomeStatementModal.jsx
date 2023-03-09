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
const percentageSchema = Yup.number()
  .required('Required')
  .moreThan(-0.001, 'Must be greater than or equal to zero')
  .max(100, 'Must be less than 100');

const IncomeStatementSchema = Yup.object().shape({
  [FIELD_KEYS.INC_PRIMARY_ANNUAL]: priceSchema,
  [FIELD_KEYS.INC_PRIMARY_TAX_FED]: percentageSchema,
  [FIELD_KEYS.INC_PRIMARY_TAX_STATE]: percentageSchema,
  [FIELD_KEYS.INC_VARIABLE_MONTHLY]: priceSchema,
  [FIELD_KEYS.INC_VARIABLE_TAX_FED]: percentageSchema,
  [FIELD_KEYS.INC_VARIABLE_TAX_STATE]: percentageSchema,
  [FIELD_KEYS.INC_SECONDARY_MONTHLY]: priceSchema,
  [FIELD_KEYS.INC_SECONDARY_TAX_FED]: percentageSchema,
  [FIELD_KEYS.INC_SECONDARY_TAX_STATE]: percentageSchema,
  [FIELD_KEYS.EXP_HOUSING]: priceSchema,
  [FIELD_KEYS.EXP_OTHER_FIXED]: priceSchema,
  [FIELD_KEYS.EXP_OTHER_VARIABLE]: priceSchema,
  [FIELD_KEYS.SAV_RETIREMENT]: priceSchema,
  [FIELD_KEYS.SAV_MARKET]: priceSchema,
});

export const APPLICABLE_FIELD_KEYS = [
  FIELD_KEYS.INC_PRIMARY_ANNUAL,
  FIELD_KEYS.INC_PRIMARY_TAX_FED,
  FIELD_KEYS.INC_PRIMARY_TAX_STATE,
  FIELD_KEYS.INC_VARIABLE_MONTHLY,
  FIELD_KEYS.INC_VARIABLE_TAX_FED,
  FIELD_KEYS.INC_VARIABLE_TAX_STATE,
  FIELD_KEYS.INC_SECONDARY_MONTHLY,
  FIELD_KEYS.INC_SECONDARY_TAX_FED,
  FIELD_KEYS.INC_SECONDARY_TAX_STATE,
  FIELD_KEYS.EXP_HOUSING,
  FIELD_KEYS.EXP_OTHER_FIXED,
  FIELD_KEYS.EXP_OTHER_VARIABLE,
  FIELD_KEYS.SAV_RETIREMENT,
  FIELD_KEYS.SAV_MARKET,
];

const getInitialValues = ({ user, fieldKeys }) => {
  const out = {};
  for (const fieldKey of fieldKeys) {
    const value = user[fieldKey];
    out[fieldKey] = value === null ? '' : value;
  }
  return out;
};

const EditIncomeStatementModal = ({ isOpen, onClose, onUpdate, user, requiresOnboarding }) => {
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
        validationSchema={IncomeStatementSchema}
        validateOnMount
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {({ handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>
                {requiresOnboarding ? 'Set up income statement' : 'Edit income statement'}
              </ModalHeader>
              {!requiresOnboarding && <ModalCloseButton />}
              <ModalBody>
                <Flex direction="column">
                  {requiresOnboarding && (
                    <Text marginBottom={4}>{FIELD_TOOLTIPS.incomeStatement}</Text>
                  )}
                  <Grid gap={4}>
                    <GridItem>
                      <GridSectionSubHeading
                        title="Primary income"
                        tooltipInfo={FIELD_TOOLTIPS.primaryIncome}
                      />
                      <Grid gap={4} templateColumns="repeat(3, 1fr)">
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_PRIMARY_ANNUAL}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm', autoFocus: 'autofocus' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_PRIMARY_TAX_FED}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_PRIMARY_TAX_STATE}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                      </Grid>
                    </GridItem>
                    <GridItem>
                      <GridSectionSubHeading
                        title="Variable income"
                        tooltipInfo={FIELD_TOOLTIPS.variableIncome}
                      />
                      <Grid gap={4} templateColumns="repeat(3, 1fr)">
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_VARIABLE_MONTHLY}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_VARIABLE_TAX_FED}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_VARIABLE_TAX_STATE}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                      </Grid>
                    </GridItem>
                    <GridItem>
                      <GridSectionSubHeading
                        title="Secondary income"
                        tooltipInfo={FIELD_TOOLTIPS.secondaryIncome}
                      />
                      <Grid gap={4} templateColumns="repeat(3, 1fr)">
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_SECONDARY_MONTHLY}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_SECONDARY_TAX_FED}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.INC_SECONDARY_TAX_STATE}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                      </Grid>
                    </GridItem>
                    <GridItem>
                      <GridSectionSubHeading
                        title="Monthly expenses"
                        tooltipInfo={FIELD_TOOLTIPS.monthlyExpenses}
                      />
                      <Grid gap={4} templateColumns="repeat(3, 1fr)">
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.EXP_HOUSING}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.EXP_OTHER_FIXED}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.EXP_OTHER_VARIABLE}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                      </Grid>
                    </GridItem>
                    <GridItem>
                      <GridSectionSubHeading
                        title="Monthly savings"
                        tooltipInfo={FIELD_TOOLTIPS.monthlySavings}
                      />
                      <Grid gap={4} templateColumns="repeat(3, 1fr)">
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.SAV_RETIREMENT}
                            inputComponent={NumberInputFormComponent}
                            inputProps={{ size: 'sm' }}
                          />
                        </GridItem>
                        <GridItem colSpan={1} rowSpan={1}>
                          <ControlledFormFieldValue
                            fieldKey={FIELD_KEYS.SAV_MARKET}
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

export default EditIncomeStatementModal;
