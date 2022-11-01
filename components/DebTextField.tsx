import React, { useState, useEffect } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type Props = {
  onChangeValue: ({ value }: { value: string }) => void;
} & TextFieldProps;

const DebTextField = ({
  onChange = (_e) => {},
  onChangeValue = (_e) => {},
  defaultValue,
  value = '',
  ...others
}: Props) => {
  const [innerValue, setInnerValue] = useState(
    defaultValue ? defaultValue : value
  );

  useEffect(() => {
    let id: any = 0;
    id = setTimeout(
      (value) => {
        id = 0;
        onChangeValue({ value: value });
      },
      500,
      innerValue
    );
    return () => {
      if (id !== 0) {
        clearTimeout(id);
      }
    };
  }, [onChangeValue, innerValue]);

  return (
    <TextField
      onChange={(e) => {
        onChange(e);
        setInnerValue(e.target.value);
      }}
      value={innerValue}
      {...others}
    />
  );
};

export default DebTextField;
