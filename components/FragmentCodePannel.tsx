import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useSnackbar } from 'notistack';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// https://stackoverflow.com/questions/58966891/nextjs-unexpected-token-import
import bash from 'react-syntax-highlighter/dist/cjs/languages/hljs/bash';
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json';
import { androidstudio } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import copyTextToClipboard from '../utils/clipboard';

const useStyles = makeStyles((theme) => ({
  codeOuter: {
    fontSize: theme.typography.h6.fontSize
  }
}));

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);

// type Props = {} & TextFieldProps;
type InnerProps = {
  id?: string;
  defaultOpened?: boolean;
  label: React.ReactNode;
  value: string;
  language?: string;
};
type Props = {
  summary?: React.ReactNode;
  naked?: boolean;
} & InnerProps;

const FragmentCodePannelInner = ({
  defaultOpened = false,
  label,
  value,
  language = ''
}: InnerProps) => {
  const classes = useStyles();

  const [open, setOpen] = useState(defaultOpened);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Box flexGrow="1">
          <Typography variant="body1">{label}</Typography>
        </Box>
        <IconButton onClick={() => setOpen(!open)}>
          <CodeIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => {
            copyTextToClipboard(value).then(
              () => {
                enqueueSnackbar('The code has been copied.', {
                  variant: 'success'
                });
              },
              (err) => {
                enqueueSnackbar(`error in cpoing the code: ${err.message} `, {
                  variant: 'error'
                });
              }
            );
          }}
        >
          <FileCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Box className={classes.codeOuter}>
          <SyntaxHighlighter
            wrapLines
            wrapLongLines
            style={androidstudio}
            language={language}
          >
            {value}
          </SyntaxHighlighter>
        </Box>
      </Collapse>
    </Box>
  );
};

const FragmentCodePanel = ({
  summary = '',
  naked = false,
  ...others
}: Props) => {
  if (naked) {
    return <FragmentCodePannelInner {...others} />;
  }
  return (
    <Box>
      <Paper>
        <Box mx={1} p={1}>
          <Box>{summary}</Box>
          <Box my={1}>
            <FragmentCodePannelInner {...others} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FragmentCodePanel;
