import { Select } from 'chakra-react-select';
import { CURRENT_PFM_LABELS } from '../constants';

const OPTIONS = Object.entries(CURRENT_PFM_LABELS).map(([value, label]) => {
  return { value, label };
});

const CurrentPFMSelector = ({ onChange, size = 'sm' }) => {
  return <Select onChange={onChange} options={OPTIONS} size={size} isMulti={true} />;
};

export default CurrentPFMSelector;
