import { Select } from "chakra-react-select";

const GENDER_KEYS = {
  MALE: 'male',
  FEMALE: 'female',
  TRANSGENDER: 'transgender',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
};

export const GENDER_LABELS = {
  [GENDER_KEYS.MALE]: 'Male',
  [GENDER_KEYS.FEMALE]: 'Female',
  [GENDER_KEYS.TRANSGENDER]: 'Transgender',
  [GENDER_KEYS.PREFER_NOT_TO_SAY]: 'Prefer not to say',
}

const OPTIONS = Object.entries(GENDER_LABELS).map(([value, label]) => {
  return { value, label };
});

const GenderSelector = ({ onChange, size = "sm" }) => {
  return (
    <Select 
      onChange={onChange}
      options={OPTIONS}
      size={size}
    />
  )
};

export default GenderSelector;
