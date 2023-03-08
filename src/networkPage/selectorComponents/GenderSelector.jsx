import Select from '../../components/Select'
import { GENDER_LABELS } from '../../constants/all';

const OPTIONS = Object.entries(GENDER_LABELS).map(([value, label]) => {
  return { value, label };
});

const GenderSelector = ({ onChange, size = 'sm' }) => {
  return <Select onChange={onChange} options={OPTIONS} size={size} isMulti={true} />;
};

export default GenderSelector;
