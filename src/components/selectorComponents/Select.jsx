import { Select as ReactSelect } from 'chakra-react-select';

const Select = (props) => {
  return (
    <ReactSelect
      {...props}
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
};

export default Select;
