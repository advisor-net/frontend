import { AsyncSelect as ReactAsyncSelect } from 'chakra-react-select';

const AsyncSelect = (props) => {
  return (
    <ReactAsyncSelect
      {...props}
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
};

export default AsyncSelect;
