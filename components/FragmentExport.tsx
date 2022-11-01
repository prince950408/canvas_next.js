import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import PreviewContext, {
  PreviewContextState
} from '../components/PreviewContext';
import FragmentCodePanel from '../components/FragmentCodePannel';

const FragmentExport = () => {
  const previewStateContext = useContext(PreviewContext);

  const [stateContextJson, setStateContextJson] = useState('');

  useEffect(() => {
    const exportContext: PreviewContextState = JSON.parse(
      JSON.stringify({
        ...previewStateContext,
        validateAssets: undefined,
        assets: undefined,
        templateIdx: undefined
      })
    );
    const orgDefaultTargetKey = exportContext.defaultTargetKey;
    const orgEditTargetKey = exportContext.editTargetKey;
    exportContext.defaultTargetKey = 'DEFAULT-TARGET-KEY';
    exportContext.editTargetKey = 'EDIT-TARGET-KEY';
    exportContext.previewSet.forEach((p, idx) => {
      if (p.itemKey === orgDefaultTargetKey) {
        p.itemKey = exportContext.defaultTargetKey;
      } else if (p.itemKey === orgEditTargetKey) {
        p.itemKey = exportContext.editTargetKey;
      } else {
        p.itemKey = `ITEM-KEY-${idx + 1}`;
      }
    });

    setStateContextJson(JSON.stringify(exportContext, null, '  '));
  }, [previewStateContext]);

  return (
    <Box p={1} mx={1}>
      <FragmentCodePanel
        defaultOpened
        naked
        label="json"
        value={stateContextJson}
      />
    </Box>
  );
};

export default FragmentExport;
