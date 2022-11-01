import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import PreviewContext from '../components/PreviewContext';
import FragmentCodePanel from '../components/FragmentCodePannel';

const FragmentLinks = () => {
  const previewStateContext = useContext(PreviewContext);
  const [imgUrl, setImgUrl] = useState('');
  const [imgPath, setImgPath] = useState('');

  useEffect(() => {
    try {
      const tmpImgUrl: string[] = [];
      const tmpImgPath: string[] = [];
      previewStateContext.previewSet.forEach((v) => {
        tmpImgUrl.push(v.previewUrl);
        const u = new URL(v.previewUrl);
        tmpImgPath.push(`${u.pathname}${u.search}`);
      });
      setImgUrl(JSON.stringify(tmpImgUrl, null, ' '));
      setImgPath(JSON.stringify(tmpImgPath, null, ' '));
    } catch {
      setImgUrl('');
      setImgPath('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Box mx={1}>
      <Box p={1}>
        <FragmentCodePanel
          defaultOpened
          naked
          label="url (array)"
          value={imgUrl}
          language="json"
        />
      </Box>
      <Box p={1}>
        <FragmentCodePanel
          defaultOpened
          naked
          label="path (array)"
          value={imgPath}
          language="json"
        />
      </Box>
    </Box>
  );
};

export default FragmentLinks;
