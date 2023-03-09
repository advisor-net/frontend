import Select from '../../components/selectorComponents/Select';
import { FILTER_TYPE_LABELS } from '../constants';

const FilterTypeSelector = ({ allowedTypes, onChange, size = 'sm', isDisabled = false, value }) => {
  const options = allowedTypes.map((filterType) => {
    return { value: filterType, label: FILTER_TYPE_LABELS[filterType] };
  });
  return (
    <Select
      placeholder="Select filter type"
      onChange={onChange}
      options={options}
      size={size}
      isDisabled={isDisabled}
      value={value}
    />
  );
};

export default FilterTypeSelector;
