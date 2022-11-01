import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../components/Link';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PreviewContext, {
  PreviewDispatch,
  PreviewItem,
  isPreviewSetReady
} from '../components/PreviewContext';
import  {
  BreakPoint,
  BreakPointAutoAndValues,
} from '../utils/intermediate';
import TemplatePanel from '../components/TemplatePanel';
import ImgPreview from '../components/ImgPreview';
import {
  BuiltinImportTemplate,
  ImportTemplateParametersSet,
  ImportTemplateKind
} from '../src/template';
import FragmentLink, { FragmentLinkQRcode } from '../components/FragmentLink';
import TemplateList from '../components/TemplateList';
import { imageTitleInfo } from '../utils/format';

const useStyles = makeStyles((theme) => ({
  tab: {
    minHeight: 10,
    '& .MuiTab-root': {
      textTransform: 'none',
      minHeight: 10,
      [theme.breakpoints.up('sm')]: {
        minWidth: 100
      }
    }
  },
  cardItem: {},
  previewOuter: {
    height: 400
  },
  linkOuter: {
    minHeight: 400
  },
  linkViewButtonOuter: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .MuiButton-root': {
      textTransform: 'none'
    }
  },
  qrCodeButton: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  targetIndicator: {
    backgroundColor: theme.palette.primary.main
  }
}));

function SetItem({
  defaultTargetKey,
  previewItem,
  onClick
}: {
  defaultTargetKey: string;
  previewItem: PreviewItem;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  const previewDispatch = useContext(PreviewDispatch);
  const classes = useStyles();
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [imgFileSize, setImgFileSize] = useState(0);

  const [tabValue, setTabValue] = useState(0);
  const [qrOpened, setQrOpened] = useState(false);

  const [mediaAnchorEl, setMediaAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMedia = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMediaAnchorEl(event.currentTarget);
  };

  const handleCloseMedia = () => {
    setMediaAnchorEl(null);
  };

  return (
    <Box my={1} p={1}>
      <Card>
        <CardHeader
          titleTypographyProps={{ variant: 'body1' }}
          title={
            <Box display="flex" alignItems="center">
              <Box flexGrow="1">
                {imgFileSize === 0 ? (
                  <Skeleton variant="rect" width="8em" />
                ) : (
                  imageTitleInfo({
                    imgWidth,
                    imgHeight,
                    imgDispDensity: previewItem.imgDispDensity,
                    imgFileSize
                  })
                )}
              </Box>
              <Box>
                <Tabs
                  className={classes.tab}
                  disabled={imgWidth === 0}
                  indicatorColor="primary"
                  textColor="primary"
                  value={tabValue}
                  onChange={(_e, newValue) => setTabValue(newValue)}
                >
                  <Tab
                    disabled={imgWidth === 0}
                    color="textSecondary"
                    label={<Typography variant="body2">Preview</Typography>}
                  />
                  <Tab
                    disabled={imgWidth === 0}
                    color="textSecondary"
                    label={<Typography variant="body2">Link</Typography>}
                  />
                </Tabs>
              </Box>
            </Box>
          }
        />
        <Box flexGrow="1" className={classes.cardItem}>
          <Box
            className={classes.previewOuter}
            display={tabValue === 0 ? 'block' : 'none'}
          >
            <CardActionArea disabled={imgWidth === 0} onClick={onClick}>
              <Box display="flex">
                <ImgPreview
                  previewUrl={previewItem.previewUrl}
                  {...{
                    fitMode: 'landscape',
                    imgGrow: 'none',
                    width: undefined,
                    height: 400
                  }}
                  skeleton={'once'}
                  onSize={({ w, h }) => {
                    setImgWidth(w);
                    setImgHeight(h);
                    if (previewItem.imgWidth === 0 && w !== 0) {
                      previewDispatch({
                        type: 'setPreviewImageSize',
                        payload: [previewItem.itemKey, w, h]
                      });
                    }
                  }}
                  onFileSize={({ imgFileSize }) => {
                    setImgFileSize(imgFileSize);
                  }}
                />
                <Box
                  width={2}
                  className={
                    defaultTargetKey === previewItem.itemKey
                      ? classes.targetIndicator
                      : undefined
                  }
                />
              </Box>
            </CardActionArea>
          </Box>
          <Box
            display={tabValue === 1 ? 'block' : 'none'}
            className={classes.linkOuter}
          >
            <CardContent>
              <Box mt={-1} p={1} className={classes.linkViewButtonOuter}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" color="textPrimary">
                    Open Image:
                  </Typography>
                  <Button
                    component={Link}
                    href={previewItem.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    disableElevation={true}
                  >
                    <OpenInNewIcon />
                  </Button>
                  <Box className={classes.qrCodeButton}>
                    <Button
                      onClick={() => setQrOpened(!qrOpened)}
                      endIcon={
                        <ExpandMoreIcon
                          style={{
                            transform: qrOpened ? 'rotate(180deg)' : ''
                          }}
                        />
                      }
                    >
                      QR Code
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Collapse in={qrOpened}>
                <Box display="flex" justifyContent="flex-end">
                  {tabValue === 1 && (
                    <FragmentLinkQRcode url={previewItem.previewUrl} />
                  )}
                </Box>
              </Collapse>
              {tabValue === 1 && <FragmentLink itemKey={previewItem.itemKey} />}
            </CardContent>
          </Box>
        </Box>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              previewDispatch({
                type: 'setDefaultTarget',
                payload: [previewItem.itemKey]
              });
            }}
          >
            Default
          </Button>
          <Button size="small" onClick={handleClickMedia}>
            <Box display="flex" alignContent="center">
              <Box>Media: </Box>
              {previewItem.media}
            </Box>
          </Button>
          <Menu
            id="select-media"
            anchorEl={mediaAnchorEl}
            keepMounted
            open={Boolean(mediaAnchorEl)}
            onClose={handleCloseMedia}
          >
            {BreakPointAutoAndValues.map((v, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  handleCloseMedia();
                  previewDispatch({
                    type: 'setPreviewImageMedia',
                    payload: [previewItem.itemKey, v]
                  });
                }}
              >
                {v}
              </MenuItem>
            ))}
          </Menu>
          <Button
            size="small"
            onClick={() => {
              previewDispatch({
                type: 'clonePreviewImageUrl',
                payload: [previewItem.itemKey]
              });
            }}
          >
            Clone
          </Button>
          <Button
            size="small"
            onClick={() => {
              previewDispatch({
                type: 'removeFromSet',
                payload: [previewItem.itemKey]
              });
            }}
          >
            Remove
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

const useActionBarStyles = makeStyles((theme) => ({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center'
    justifyContent: 'flex-end'
  },
  commandOuter: {
    //marginRight: theme.spacing(1),
    flexGrow: 1,
    '& .MuiButton-sizeSmall': {
      display: 'inline-flex',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      minWidth: '1em',
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    '& .MuiButton-sizeLarge': {
      display: 'none',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      minWidth: '1em',
      [theme.breakpoints.up('sm')]: {
        display: 'inline-flex'
      }
    }
  },
  indicatorOuter: {
    // display: 'flex',
    display: 'none', //一時的に非表示
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    '& .MuiButton-label > .MuiBox-root': {
      marginLeft: theme.spacing(1)
    }
  },
  tryItOnOuter: {
    display: 'flex',
    marginRight: theme.spacing(1),
    '& .MuiButton-root': {
      textTransform: 'none'
    }
  },
  templateLabel: {
    display: 'flex',
    justifyContent: 'flex-end',
    //width: '6em'
    maxWidth: '10em'
  },
  templateButtonLabel: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  }
}));

function ActionBarTemplateList({
  opened,
  kind,
  act,
  onExited,
  onExit
}: {
  opened: boolean;
  kind: ImportTemplateKind[];
  act: 'mergeParametersToImageUrl' | 'makeVariantImages';
  onExited: () => void;
  onExit: () => void;
}) {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);

  const [parametersSet, setParametersSet] = useState<
    ImportTemplateParametersSet
  >([]);
  const [medias, setMedias] = useState<BreakPoint[]>([]);

  return (
    <Box>
      <Collapse
        in={opened}
        onExited={() => {
          onExited();
          if (parametersSet.length > 0) {
            previewStateContext.previewSet.forEach((v) => {
              previewDispatch({
                type: act,
                payload: [v.itemKey, parametersSet, medias]
              });
            });
          }
        }}
      >
        <TemplateList
          defaultIdx={0}
          disableSelected
          kind={kind}
          onTemplate={({ parametersSet, medias }) => {
            setParametersSet(parametersSet);
            setMedias(medias);
            onExit();
          }}
        />
      </Collapse>
    </Box>
  );
}

function ActionBar({
  onTemplate
}: {
  onTemplate: ({
    templateIdx,
    parametersSet,
    medias
  }: {
    templateIdx: number;
    parametersSet: ImportTemplateParametersSet;
    medias: BreakPoint[];
  }) => void;
}) {
  const classes = useActionBarStyles();
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const [templateIdx, seTtemplateIdx] = useState(
    previewStateContext.templateIdx >= 0 ? previewStateContext.templateIdx : 0
  );
  const [disabledTryIt, setDisabledTryIt] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<
    | ''
    | 'add'
    | 'template'
    | 'size'
    | 'effect'
    | 'responsive'
    | 'card'
    | 'exiting'
  >('');
  const [nextOpen, setNextOpen] = useState<
    '' | 'add' | 'template' | 'size' | 'responsive' | 'effect' | 'card'
  >('');

  useEffect(() => {
    setDisabledTryIt(!isPreviewSetReady(previewStateContext.previewSet));
  }, [previewStateContext]);

  const handleClickCommand = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExited = useCallback(() => {
    setOpen('');
    if (nextOpen) {
      setOpen(nextOpen);
      setNextOpen('');
    }
  }, [nextOpen]);

  useEffect(() => {
    if (nextOpen) {
      switch (open) {
        case '':
          setOpen(nextOpen);
          setNextOpen('');
          break;
        case 'exiting':
          break;
        default:
          if (open === nextOpen) {
            setNextOpen('');
          }
          setOpen('exiting');
          break;
      }
    }
  }, [open, nextOpen]);

  return (
    <Box>
      <Box className={classes.bar}>
        <Box className={classes.commandOuter}>
          <Button size="small" variant="outlined" onClick={handleClickCommand}>
            <MoreVertIcon fontSize="small" />
          </Button>
          <Button size="large" variant="outlined" onClick={handleClickCommand}>
            <MoreVertIcon fontSize="small" />
          </Button>
          <Menu
            id="command-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                setNextOpen('add');
              }}
            >
              Add Image
            </MenuItem>
          </Menu>
        </Box>
        <Box className={classes.indicatorOuter}>
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
            onClick={() => setNextOpen('template')}
            style={{ textTransform: 'none' }}
          >
            <Collapse in={open !== 'template'}>
              <Box className={classes.templateLabel}>
                <Typography variant="body1" noWrap>
                  {BuiltinImportTemplate[templateIdx].label}
                </Typography>
              </Box>
            </Collapse>
            <Box className={classes.templateButtonLabel}>
              <Typography variant="body1">template</Typography>
            </Box>
          </Button>
        </Box>
        <Box className={classes.tryItOnOuter}>
          <Button
            color="default"
            disableElevation={true}
            variant="outlined"
            disabled={disabledTryIt}
            onClick={() => {
              previewDispatch({
                type: 'resetPreviewSet',
                payload: []
              });
              previewDispatch({
                type: 'importPreviewSet',
                payload: [
                  previewStateContext.previewSetKind,
                  previewStateContext.imageBaseUrl,
                  previewStateContext.baseParameterSet,
                  previewStateContext.baseMedias
                ]
              });
            }}
          >
            Reset
          </Button>
        </Box>
        <Box className={classes.tryItOnOuter}>
          <Button
            color="default"
            disableElevation={true}
            variant="outlined"
            disabled={
              disabledTryIt || previewStateContext.previewSet.length !== 1
            }
            onClick={() => setNextOpen('card')}
          >
            Card
          </Button>
        </Box>
        <Box className={classes.tryItOnOuter}>
          <Button
            color="default"
            disableElevation={true}
            variant="outlined"
            disabled={
              disabledTryIt || previewStateContext.previewSet.length !== 1
            }
            onClick={() => setNextOpen('responsive')}
          >
            Responsive
          </Button>
        </Box>
        <Box className={classes.tryItOnOuter}>
          <Button
            color="default"
            disableElevation={true}
            variant="outlined"
            disabled={disabledTryIt}
            onClick={() => setNextOpen('effect')}
          >
            Effect
          </Button>
        </Box>
        <Box className={classes.tryItOnOuter}>
          <Button
            color="default"
            disableElevation={true}
            variant="outlined"
            disabled={disabledTryIt}
            onClick={() => setNextOpen('size')}
          >
            Size
          </Button>
        </Box>
        <Box className={classes.tryItOnOuter}>
          <Button
            component={Link}
            disableElevation={true}
            href="/tryit"
            color="primary"
            className={
              disabledTryIt
                ? 'MuiButton-contained Mui-disabled'
                : 'MuiButton-containedPrimary'
            }
            disabled={disabledTryIt}
          >
            Try it
          </Button>
        </Box>
      </Box>
      <Box>
        <Collapse in={open === 'template'} onExited={handleExited}>
          <TemplatePanel
            defaultIdx={previewStateContext.templateIdx}
            disabled={
              previewStateContext.previewSetState === 'edited' ||
              previewStateContext.imageBaseUrl === ''
            }
            onTemplate={({ templateIdx: idx, parametersSet, medias }) => {
              seTtemplateIdx(idx);
              onTemplate({
                templateIdx: idx,
                parametersSet: parametersSet,
                medias: medias
              });
            }}
          />
        </Collapse>
      </Box>
      <Box>
        <ActionBarTemplateList
          opened={open === 'card'}
          kind={['card']}
          act={'mergeParametersToImageUrl'}
          onExit={() => setNextOpen('card')}
          onExited={handleExited}
        />
      </Box>
      <Box>
        <ActionBarTemplateList
          opened={open === 'responsive'}
          kind={['responsive']}
          act={'makeVariantImages'}
          onExit={() => setNextOpen('responsive')}
          onExited={handleExited}
        />
      </Box>
      <Box>
        <ActionBarTemplateList
          opened={open === 'effect'}
          kind={['effective']}
          act={'mergeParametersToImageUrl'}
          onExit={() => setNextOpen('effect')}
          onExited={handleExited}
        />
      </Box>
      <Box>
        <ActionBarTemplateList
          opened={open === 'size'}
          kind={['size']}
          act={'mergeParametersToImageUrl'}
          onExit={() => setNextOpen('size')}
          onExited={handleExited}
        />
      </Box>
      <Box>
        <Collapse in={open === 'add'} onExited={handleExited}>
          <Typography variant="body1">Add: not implement yet</Typography>
        </Collapse>
      </Box>
    </Box>
  );
}

const WorkbenchPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();

  // useEffect(() => {
  //   if (sampleImageBaseUrl !== '') {
  //     previewDispatch({
  //       type: 'resetPreviewSet',
  //       payload: []
  //     });
  //     previewDispatch({
  //       type: 'importPreviewSet',
  //       payload: ['sample', sampleImageBaseUrl, sampleParametersSet]
  //     });
  //   }
  // }, [previewDispatch, sampleImageBaseUrl, sampleParametersSet]);

  useEffect(() => {
    if (isPreviewSetReady(previewStateContext.previewSet)) {
      previewDispatch({
        type: 'sortSet',
        payload: []
      });
    }
  }, [previewDispatch, previewStateContext.previewSet]);

  return (
    <Layout title="Workbench">
      <Container maxWidth="md">
        <Box py={1}></Box>
        <ActionBar onTemplate={(_e) => {}} />
        <Box>
          {previewStateContext.previewSet.map((v) => (
            <SetItem
              key={v.itemKey}
              defaultTargetKey={previewStateContext.defaultTargetKey}
              previewItem={v}
              onClick={() => {
                previewDispatch({
                  type: 'setEditTarget',
                  payload: [v.itemKey]
                });
                // https://github.com/vercel/next.js/issues/3249
                // browser によっては、Alt+left で戻るとスクロール位置がリセットされている:
                router.push('/render').then(() => window.scrollTo(0, 0));
              }}
            />
          ))}
        </Box>
      </Container>
    </Layout>
  );
};

export default WorkbenchPage;
