import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import {
  BuiltinImportTemplate,
  ImportTemplateParametersSet,
  ImportTemplateKind,
  ImportTemplate
} from '../src/template';
import { BreakPoint } from '../utils/intermediate';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}));

type IndexedTemplateList = (ImportTemplate & { idx: number })[];

const indexedTemplateList = BuiltinImportTemplate.map((v, idx) => ({
  ...v,
  idx
}));

function getTemplateList(
  list: IndexedTemplateList,
  kind: ImportTemplateKind[]
): IndexedTemplateList {
  if (kind.length > 0) {
    return list.filter(({ kind: v }) => v.some((v) => kind.indexOf(v) >= 0));
  }
  return list.slice();
}

function getIdxFromList(idx: number, list: IndexedTemplateList): number {
  return list.findIndex((v) => v.idx === idx);
}

type Props = {
  defaultIdx: number;
  kind?: ImportTemplateKind[];
  disableSelected?: boolean;
  onTemplate: ({
    templateIdx,
    parametersSet,
    medias
  }: {
    templateIdx: number;
    parametersSet: ImportTemplateParametersSet;
    medias: BreakPoint[];
  }) => void;
};

const TemplateList = ({
  defaultIdx = 0,
  disableSelected = false,
  kind = [],
  onTemplate
}: Props) => {
  const classes = useStyles();
  //  const [open, setOpen] = useState(defaultIdx < 0);
  const templateList = getTemplateList(indexedTemplateList, kind);
  const idx = getIdxFromList(defaultIdx, templateList);
  const [templateIdx, setTemplateIdx] = useState(idx >= 0 ? idx : 0);

  useEffect(() => {
    if (templateIdx >= templateList.length) {
      setTemplateIdx(0);
    }
  }, [templateIdx, templateList.length]);

  return (
    <Box className={classes.root}>
      <List component="nav" aria-label="template list">
        {templateList.map((v, i) => (
          <ListItem
            key={i}
            button
            onClick={() => {
              setTemplateIdx(i);
              const t = templateList[i];
              onTemplate({
                templateIdx: t.idx,
                parametersSet: templateList[i].parameters,
                medias: templateList[i].medias
              });
            }}
          >
            {!disableSelected && (
              <ListItemIcon>{templateIdx === i && <CheckIcon />}</ListItemIcon>
            )}
            <ListItemText primary={v.label} secondary={v.shortDescription} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TemplateList;
