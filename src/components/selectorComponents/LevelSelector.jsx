import Select from './Select'
import { JOB_LEVEL_LABELS } from '../../constants/all';

const OPTIONS = Object.entries(JOB_LEVEL_LABELS).map(([value, label]) => {
  return { value, label };
});

const IGNORE = '||$$IGNORE$$||';

const LevelSelector = ({ isMulti, onChange, size = 'sm', value = IGNORE }) => {
  return value !== IGNORE 
    ? <Select onChange={onChange} options={OPTIONS} size={size} isMulti={isMulti} value={value}/>
    : <Select onChange={onChange} options={OPTIONS} size={size} isMulti={isMulti} />;
};

export default LevelSelector;
