import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { basename, extname } from 'path';
import PreviewContext from '../components/PreviewContext';
import FragmentCodePanel from '../components/FragmentCodePannel';
import shellescape from 'shell-escape';

const FragmentDownload = () => {
  const previewStateContext = useContext(PreviewContext);
  const [downloadImagesCommands, setDownloadImagesCommands] = useState('');

  useEffect(() => {
    try {
      const commands: string[] = [];
      previewStateContext.previewSet.forEach((v) => {
        const u = new URL(v.previewUrl);
        const fileName = basename(u.pathname);
        const extName = extname(fileName);
        const fileBaseName = fileName.slice(
          0,
          fileName.length - extName.length
        );
        commands.push(
          `${shellescape([
            'curl',
            '-fL',
            '-o',
            `${fileBaseName}-w${v.imgWidth}${extName}`,
            '--',
            v.previewUrl
          ])}`
        );
      });
      setDownloadImagesCommands(commands.join('\n'));
    } catch {
      setDownloadImagesCommands('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Box mx={1}>
      <Box mx={1} p={1}>
        <Typography variant="h6">Usage:</Typography>
        <Typography component={'span'} variant="body1">
          <ul>
            <li>open your favorite shell.</li>
            <li>run following "commands".</li>
          </ul>
        </Typography>
      </Box>
      <Box p={1}>
        <FragmentCodePanel
          defaultOpened
          naked
          label="commands"
          value={downloadImagesCommands}
          language="bash"
        />
      </Box>
    </Box>
  );
};

export default FragmentDownload;
