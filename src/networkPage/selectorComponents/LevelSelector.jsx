import { Select } from "chakra-react-select";

export const JOB_LEVEL_LABELS = {
  1: 'IC, Associate',
  2: 'IC',
  3: 'IC, Senior',
  4: 'IC, Staff',
  5: 'IC, Principal',
  6: 'Manager',
  7: 'Director',
  8: 'Director, Senior',
  9: 'VP',
  10: 'VP, Senior',
  11: 'C-Suite',
  12: 'Founder',
};

const OPTIONS = Object.entries(JOB_LEVEL_LABELS).map(([value, label]) => {
  return { value, label };
});

const LevelSelector = ({ onChange, size = "sm" }) => {
  return (
    <Select 
      onChange={onChange}
      options={OPTIONS}
      size={size}
    />
  )
};

export default LevelSelector;
