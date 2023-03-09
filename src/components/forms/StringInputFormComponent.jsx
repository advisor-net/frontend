import { Input } from '@chakra-ui/react';

const StringInputFormComponent = (props) => {
  const { onChange } = props;
  return <Input {...props} onChange={(e) => onChange(e.target.value)} />;
};

export default StringInputFormComponent;
