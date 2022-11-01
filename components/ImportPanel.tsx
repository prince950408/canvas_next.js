import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputIcon from '@material-ui/icons/Input';
import Ajv from 'ajv';
import ImgBaseUrl, {
  BaseUrlOnChangeEvent,
  BaseUrlOnEnterKeyEvent
} from './ImgBaseUrl';

const ajv = new Ajv();
const validate = ajv.compile(require('../src/jsonSchemaPreviewContext.json'));

type Props = {
  label: [string, string];
  defaultValue?: string;
  disabled?: boolean;
  onSelect: ({
    value
  }: {
    value: { json: string; imageBaseUrl: string };
  }) => void;
};

const ImportPanel = ({ label, onSelect }: Props) => {
  const [importJsonValue, setImportJsonValue] = useState('');
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [imageBaseUrlDisabled, setImageBaseUrlDisabled] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (importJsonValue) {
      setButtonDisabled(false);
      setImageBaseUrlDisabled(false);
    } else {
      setButtonDisabled(true);
      setImageBaseUrlDisabled(true);
    }
  }, [importJsonValue]);

  return (
    <Box display="flex" alignItems="flex-start">
      <Box flexGrow="1">
        <TextField
          id="import-json"
          label={label[0]}
          // defaultValue={''}
          // value={value}
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          onChange={(e) => {
            const newValue = e.target.value;
            setImportJsonValue('');
            try {
              const state = JSON.parse(newValue);
              if (validate(state)) {
                setImportJsonValue(newValue);
              }
            } catch (_err) {}
          }}
        />
        <ImgBaseUrl
          label={label[1]}
          baseUrl={imageBaseUrl}
          disabled={imageBaseUrlDisabled}
          onEnterKey={(_e: BaseUrlOnEnterKeyEvent) => {
            setButtonDisabled(true);
            onSelect({
              value: { json: importJsonValue, imageBaseUrl: imageBaseUrl }
            });
          }}
          onChange={(e: BaseUrlOnChangeEvent) =>
            setImageBaseUrl(e.value.split('?', 2)[0])
          }
        />
      </Box>
      <Box p={1}>
        <Button
          color="primary"
          variant="contained"
          size="small"
          startIcon={<InputIcon fontSize="small" />}
          disabled={buttonDisabled}
          disableElevation={true}
          onClick={() => {
            setButtonDisabled(true);
            onSelect({
              value: { json: importJsonValue, imageBaseUrl: imageBaseUrl }
            });
          }}
        >
          Import
        </Button>
      </Box>
    </Box>
  );
};

export default ImportPanel;
