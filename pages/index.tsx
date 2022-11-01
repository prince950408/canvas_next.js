import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PreviewContext, {
  PreviewDispatch,
  PreviewSetKind
} from '../components/PreviewContext';
import { BreakPoint } from '../utils/intermediate';
import EnterPanel from '../components/EnterPanel';
import SamplePanel from '../components/SamplePanel';
import ImportPanel from '../components/ImportPanel';
import TemplateList from '../components/TemplateList';
import {
  ImportTemplateParametersSet,
  getImportTemplateItem
} from '../src/template';

const IndexPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();

  const [selected, setSelected] = useState(false);
  const [open, setOpen] = useState<'' | 'template'>('');

  const [tabValue, setTabValue] = useState(0);
  const [imageBaseUrl, setImageBaseUrl] = useState(
    previewStateContext.previewSetKind === 'recv'
      ? previewStateContext.imageBaseUrl
      : ''
  );
  const [previewSetKind, setPreviewSetKind] = useState<PreviewSetKind>('');
  const [importJson, setImportJson] = useState('');
  const [importImageBaseUrl, setImportImageBaseUrl] = useState('');

  const [templateIdx, setTemplateIdx] = useState(
    previewStateContext.templateIdx >= 0 ? previewStateContext.templateIdx : 0
  );
  const item = getImportTemplateItem(templateIdx);
  const [templateLabel, setTemplateLabel] = useState(item ? item.label : '');
  const [templateShortDescription, setTemplateShortDescription] = useState(
    item ? item.shortDescription || '' : ''
  );

  const [parametersSet, setParametersSet] = useState<
    ImportTemplateParametersSet
  >([]);
  const [medias, setMedias] = useState<BreakPoint[]>([]);

  useEffect(() => {
    previewDispatch({
      type: 'setTemplateIdx',
      payload: [templateIdx]
    });
    const item = getImportTemplateItem(templateIdx);
    if (item) {
      setTemplateLabel(item.label);
      setTemplateShortDescription(item.shortDescription || '');
      setParametersSet(item.parameters);
      setMedias(item.medias);
    }
  }, [previewDispatch, templateIdx]);

  useEffect(() => {
    return () => {
      if (imageBaseUrl !== '') {
        previewDispatch({
          type: 'setImageBaseUrl',
          payload: [previewSetKind, imageBaseUrl]
        });
        previewDispatch({
          type: 'resetPreviewSet',
          payload: []
        });
        previewDispatch({
          type: 'importPreviewSet',
          payload: ['data', imageBaseUrl, parametersSet, medias]
        });
      } else if (importJson !== '') {
        previewDispatch({
          type: 'importJson',
          payload: [importJson, importImageBaseUrl]
        });
      }
    };
  }, [
    previewDispatch,
    previewStateContext.imageBaseUrl,
    imageBaseUrl,
    previewSetKind,
    parametersSet,
    medias,
    importJson,
    importImageBaseUrl
  ]);

  useEffect(() => {
    if (selected) {
      router.push('/workbench');
    }
  }, [router, selected]);

  return (
    <Layout title="Home">
      <Container maxWidth="md">
        <Box>
          <Box>
            <Button
              endIcon={
                <ExpandMoreIcon
                  style={{
                    transform:
                      open === 'template'
                        ? 'rotate(180deg)'
                        : '' /*'rotate(270deg)'*/
                  }}
                />
              }
              onClick={() => setOpen(open ? '' : 'template')}
              style={{ textTransform: 'none' }}
            >
              <Box>
                <Box display="flex" justifyContent="flex-start">
                  <Typography variant="body1">{templateLabel}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-start">
                  <Typography variant="body2">
                    {templateShortDescription}
                  </Typography>
                </Box>
              </Box>
            </Button>
            <Collapse in={open === 'template'}>
              <TemplateList
                defaultIdx={templateIdx}
                onTemplate={({ templateIdx: idx }) => {
                  setTemplateIdx(idx);
                  setOpen('');
                }}
              />
            </Collapse>
          </Box>
          <Tabs
            id="enter-import-tabs"
            indicatorColor="primary"
            textColor="primary"
            value={tabValue}
            onChange={(_event, newValue) => setTabValue(newValue)}
          >
            <Tab label="Enter" />
            <Tab label="Import" />
          </Tabs>
          {tabValue === 0 && (
            <>
              <Box mt={1}>
                <EnterPanel
                  label="Enter image url or select sample"
                  defaultValue={imageBaseUrl}
                  disabled={selected}
                  onSelect={({ value }) => {
                    setImageBaseUrl(value);
                    setPreviewSetKind('data');
                    setSelected(true);
                  }}
                />
              </Box>
              <Box mt={1}>
                <SamplePanel
                  onSelect={({ value }) => {
                    setImageBaseUrl(value);
                    setPreviewSetKind('sample');
                    setSelected(true);
                  }}
                />
              </Box>
            </>
          )}
          {tabValue === 1 && (
            <>
              <Box mt={1}>
                <ImportPanel
                  label={[
                    'Import JSON',
                    'Enter Image url to replace iamges(optional)'
                  ]}
                  onSelect={({ value: { json, imageBaseUrl } }) => {
                    setImportJson(json);
                    setImportImageBaseUrl(imageBaseUrl);
                    setSelected(true);
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
