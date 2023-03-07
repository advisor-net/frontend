import { Select } from "chakra-react-select";
import { JOB_LEVEL_LABELS } from "../constants";

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
