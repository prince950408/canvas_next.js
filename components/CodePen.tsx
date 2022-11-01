import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { CodePenDefinePostData } from '../utils/codePen';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiButton-root': {
      textTransform: 'none'
    }
  }
}));

type Props = {
  title: string;
  html: string;
  js?: string;
  buttonLabel: string;
  buttonProps: ButtonProps;
};

const CodePenDefineForm = ({
  title,
  html,
  js = '',
  buttonLabel,
  buttonProps
}: Props) => {
  const classes = useStyles();
  const [value, setValue] = useState('');

  useEffect(() => {
    const o: CodePenDefinePostData = {
      title: title,
      html: html,
      js: js
    };
    setValue(JSON.stringify(o));
  }, [title, html]);

  return (
    <Box className={classes.root}>
      <form
        action="https://codepen.io/pen/define"
        method="POST"
        target="_blank"
      >
        <input type="hidden" name="data" value={value} />
        <Button
          type="submit"
          value="Create New Pen with Prefilled Data"
          {...buttonProps}
        >
          {buttonLabel}
        </Button>
      </form>
    </Box>
  );
};

export default CodePenDefineForm;
