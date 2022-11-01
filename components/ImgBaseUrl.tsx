import React, { useEffect, useState, useContext, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import PreviewContext from '../components/PreviewContext';
import Validator from '../utils/validator';

const validator = Validator();

export type BaseUrlOnChangeEvent = { value: string };
export type BaseUrlOnEnterKeyEvent = { value: string };

type BaseUrlParamsProps = {
  label: string;
  baseUrl: string;
  disabled?: boolean;
  onChange: (e: BaseUrlOnChangeEvent) => void;
  onEnterKey?: (e: BaseUrlOnEnterKeyEvent) => void;
};

export default function ImgBaseUrl({
  label,
  baseUrl,
  disabled = false,
  onChange,
  onEnterKey = (_e) => {}
}: BaseUrlParamsProps) {
  const { validateAssets, assets } = useContext(PreviewContext);
  const [value, setValue] = useState(baseUrl);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setValue(baseUrl);
  }, [baseUrl]);

  const validatedValue = useCallback(
    (newValue: string) => {
      if (newValue) {
        const err = validator.assets(newValue, validateAssets, assets, true);
        if (err) {
          setErrMsg(err.message);
          return '';
        } else {
          setErrMsg('');
          return newValue;
        }
      }
      return newValue;
    },
    [validateAssets, assets]
  );

  return (
    <Box>
      <TextField
        error={errMsg ? true : false}
        id="image-base-url"
        label={label}
        // defaultValue={''}
        value={value}
        fullWidth
        helperText={errMsg}
        disabled={disabled}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            if (errMsg === '' && value) {
              onEnterKey({ value: value });
            }
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          onChange({ value: validatedValue(newValue) });
        }}
      />
    </Box>
  );
}
