import { Select } from 'chakra-react-select';
import { GENDER_LABELS } from '../constants';

const OPTIONS = Object.entries(GENDER_LABELS).map(([value, label]) => {
  return { value, label };
});

const GenderSelector = ({ onChange, size = 'sm' }) => {
  return <Select onChange={onChange} options={OPTIONS} size={size} isMulti={true} />;
};

export default GenderSelector;
