import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import ImgBaseUrl, {
  BaseUrlOnChangeEvent,
  BaseUrlOnEnterKeyEvent
} from '../components/ImgBaseUrl';

type Props = {
  label: string;
  defaultValue?: string;
  disabled?: boolean;
  onSelect: ({ value }: { value: string }) => void;
};

const EnterPanel = ({
  label,
  defaultValue = '',
  disabled = false,
  onSelect
}: Props) => {
  const [imageBaseUrl, setImageBaseUrl] = useState(defaultValue);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(imageBaseUrl === '' || disabled);
  }, [imageBaseUrl, disabled]);

  return (
    <Box display="flex" alignItems="flex-end">
      <Box flexGrow="1">
        <ImgBaseUrl
          label={label}
          baseUrl={imageBaseUrl}
          disabled={disabled}
          onEnterKey={(_e: BaseUrlOnEnterKeyEvent) => {
            // onSelect({ value: e.value });
            onSelect({ value: imageBaseUrl });
          }}
          onChange={(e: BaseUrlOnChangeEvent) => setImageBaseUrl(e.value)}
        />
      </Box>
      <Box p={1}>
        <Button
          color="primary"
          variant="contained"
          size="small"
          startIcon={<AddPhotoAlternateIcon fontSize="small" />}
          disabled={buttonDisabled}
          disableElevation={true}
          onClick={() => {
            onSelect({ value: imageBaseUrl });
          }}
        >
          New
        </Button>
      </Box>
    </Box>
  );
};

export default EnterPanel;
