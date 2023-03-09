import { forwardRef } from 'react';
import { Input } from '@chakra-ui/react';

const StringInputFormComponent = forwardRef((props, ref) => {
  const { onChange } = props;
  return <Input ref={ref} {...props} onChange={(e) => onChange(e.target.value)} />;
});

export default StringInputFormComponent;
