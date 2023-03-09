import Select from './Select';
import { GENDER_LABELS } from '../../constants/all';

const OPTIONS = Object.entries(GENDER_LABELS).map(([value, label]) => {
  return { value, label };
});

const IGNORE = '||$$IGNORE$$||';

const GenderSelector = ({ onChange, size = 'sm', isMulti, value = IGNORE }) => {
  return value !== IGNORE ? (
    <Select onChange={onChange} options={OPTIONS} size={size} isMulti={isMulti} value={value} />
  ) : (
    <Select onChange={onChange} options={OPTIONS} size={size} isMulti={isMulti} />
  );
};

export default GenderSelector;
