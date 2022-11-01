import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import QRCode from 'qrcode';
import PreviewContext, {
  getTargetItemIndex
} from '../components/PreviewContext';
import FragmentCodePanel from '../components/FragmentCodePannel';

export const FragmentLinkQRcode = ({ url }: { url: string }) => {
  const previewStateContext = useContext(PreviewContext);
  const [imgUrlQr64, setImgUrlQr64] = useState('');

  useEffect(() => {
    try {
      if (url) {
        const generateQR = async (text: string) => {
          setImgUrlQr64(await QRCode.toDataURL(text));
        };
        generateQR(url);
      } else {
        setImgUrlQr64('');
      }
    } catch {
      setImgUrlQr64('');
    }
  }, [previewStateContext.previewSet, url]);

  return (
    <Box>
      <img src={imgUrlQr64} alt="qr code to open link" />
    </Box>
  );
};

const FragmentLink = ({ itemKey }: { itemKey: string }) => {
  const previewStateContext = useContext(PreviewContext);
  const [imgUrl, setImgUrl] = useState('');
  const [imgPath, setImgPath] = useState('');

  useEffect(() => {
    try {
      const idx = getTargetItemIndex(previewStateContext.previewSet, itemKey);
      if (idx >= 0) {
        setImgUrl(previewStateContext.previewSet[idx].previewUrl);
        const u = new URL(previewStateContext.previewSet[idx].previewUrl);
        setImgPath(`${u.pathname}${u.search}`);
      } else {
        setImgUrl('');
        setImgPath('');
      }
    } catch {
      setImgUrl('');
      setImgPath('');
    }
  }, [previewStateContext.previewSet, itemKey]);

  return (
    <Box mx={1}>
      <Box p={1}>
        <FragmentCodePanel defaultOpened naked label="url" value={imgUrl} />
      </Box>
      <Box p={1}>
        <FragmentCodePanel defaultOpened naked label="path" value={imgPath} />
      </Box>
    </Box>
  );
};

export default FragmentLink;
