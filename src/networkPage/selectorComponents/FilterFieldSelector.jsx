import { Select } from "chakra-react-select";
import { FILTERABLE_FIELD_LABELS } from "../constants";

const OPTIONS = Object.entries(FILTERABLE_FIELD_LABELS).map(([value, label]) => {
  return { value, label };
});

const FilterFieldSelector = ({ onChange, size = "sm", value }) => {
  return (
    <Select 
      placeholder="Select field"
      onChange={onChange}
      options={OPTIONS}
      size={size}
      value={value}
    />
  )
};

export default FilterFieldSelector;
