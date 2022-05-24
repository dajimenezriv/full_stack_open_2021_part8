import { useState } from 'react';

const useField = (id, className, type) => {
  const [value, setValue] = useState('');

  const onChange = (e) => setValue(e.target.value);
  const reset = () => setValue('');

  return {
    id,
    className,
    type,
    onChange,
    value,
    reset,
  };
};

export default useField;
