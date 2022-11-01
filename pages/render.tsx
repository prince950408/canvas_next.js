import React, { useCallback, useEffect, useState, useContext } from 'react';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Link from '../components/Link';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PreviewContext, {
  PreviewDispatch,
  getTargetItemIndex
} from '../components/PreviewContext';
import { flattenParams, imgParasmItemInclude } from '../utils/imgParamsUtils';
import DebTextField from '../components/DebTextField';
import ImgUrl from '../components/ImgUrl';
import ImgPreview, {
  ImgPreviewFitMode,
  ImgPreviewImgGrow
} from '../components/ImgPreview';
import { FragmentLinkQRcode } from '../components/FragmentLink';
import { imageTitleInfo } from '../utils/format';

// クライアント側で毎回リスト作るのも効率悪くない?
// props 経由で渡すのは?
// どこまでサーバー側でやるのがよい?
const imgUrlParams = flattenParams();

const useStyles = makeStyles((theme) => ({
  container: {
    // chrome mobile で横スクロールが発生する状態で
    // position="fixed" で固定した領域が横幅が広がる、アドレスバーの裏に隠れるなどが発生する。
    // "auto" にすると回避できるが、これが良いのかは不明。
    // desktop の chrome で横スクロールバーが表示されるような記述があるが、
    // 試したかぎりでは出てこない。
    overflow: 'auto',
    // chrome mobile で
    [theme.breakpoints.down('md')]: {
      maxWidth: theme.breakpoints.values.sm
    }
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row'
    }
  },
  imagePanel: {
    [theme.breakpoints.up('lg')]: {
      maxWidth: theme.breakpoints.values.sm
    }
  },
  imgPreviewOuter: {
    width: '100%',
    minHeight: 200,
    [theme.breakpoints.up('lg')]: {
      height: '100%',
      width: theme.breakpoints.values.sm
    }
  },
  imgPreviewFixLgUp: {
    '& .ImagePreviewOuter': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 200
    },
    [theme.breakpoints.up('lg')]: {
      position: 'fixed',
      top: 50,
      bottom: 70,
      maxWidth: theme.breakpoints.values.sm,
      width: '100%',
      '& .ImagePreviewOuter': {
        height: '100%'
      }
    }
  },
  imageHeaderOuter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '& .MuiButton-root': {
      minWidth: 20,
      textTransform: 'none'
    }
  },
  qrCodeButton: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  }
}));

const RenderPage = () => {
  const theme = useTheme();
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const classes = useStyles();

  // useMediaQuery 初期状態では false になる? PC での表示(lg)が初期状態になる方がフリッカーが抑えられる/
  // また、スマホ(Android の Chrome)でもちらつかない。
  // ただし、PC でも md のサイズでリロードするとちらつく。
  // TODO: makeStyle で CSS の機能で試す
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const initPreviewUrl = ((): string => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.editTargetKey
    );
    return idx >= 0 ? previewStateContext.previewSet[idx].previewUrl : '';
  })();
  const [imageRawUrl] = useState(initPreviewUrl);
  const [previewUrl, setPreviewUrl] = useState(initPreviewUrl);
  const getPreviewSize = useCallback((): {
    imgWidth: number;
    imgHeight: number;
    imgDispDensity: number;
  } => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.editTargetKey
    );
    return idx >= 0
      ? {
          imgWidth: previewStateContext.previewSet[idx].imgWidth,
          imgHeight: previewStateContext.previewSet[idx].imgHeight,
          imgDispDensity: previewStateContext.previewSet[idx].imgDispDensity
        }
      : {
          imgWidth: 0,
          imgHeight: 0,
          imgDispDensity: 1
        };
  }, [previewStateContext.previewSet, previewStateContext.editTargetKey]);
  const s = getPreviewSize();
  const [imgWidth, setImgWidth] = useState(s.imgWidth);
  const [imgHeight, setImgHeight] = useState(s.imgHeight);
  const [imgFileSize, setImgFileSize] = useState(0);

  const [qrOpened, setQrOpened] = useState(false);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    previewDispatch({
      type: 'setPreviewImageUrl',
      payload: [previewUrl]
    });
    previewDispatch({
      type: 'setPreviewImageSize',
      payload: [previewStateContext.editTargetKey, imgWidth, imgHeight]
    });
    previewDispatch({
      type: 'sortSet',
      payload: []
    });
  }, [
    previewDispatch,
    previewStateContext.editTargetKey,
    previewUrl,
    imgWidth,
    imgHeight
  ]);

  const imgPreviewProps: {
    fitMode: ImgPreviewFitMode;
    imgGrow: ImgPreviewImgGrow;
    initImgWidth?: number;
    initImgHeight?: number;
    width?: number;
    height?: number;
    skeleton?: boolean | 'once';
  } = mdDown
    ? {
        fitMode: 'portrait',
        imgGrow: 'fit',
        initImgWidth: imgWidth,
        initImgHeight: imgHeight,
        width: undefined,
        // 画像の縦横比によってははみ出る(ImgPreview側で調整)
        height: 200,
        skeleton: 'once'
      }
    : {
        fitMode: 'landscape',
        imgGrow: 'fit',
        initImgWidth: imgWidth,
        initImgHeight: imgHeight,
        width: theme.breakpoints.values.sm - 50,
        height: undefined,
        skeleton: 'once'
      };
  const imgPreviewThumbProps: {
    fitMode: ImgPreviewFitMode;
    imgGrow: ImgPreviewImgGrow;
    position: string;
    top: number;
    width?: number;
    height?: number;
  } = {
    fitMode: 'portrait',
    imgGrow: 'fit',
    position: 'fixed',
    top: 0,
    width: undefined,
    // 画像の縦横比によってははみ出る(ImgPreview側で調整)
    height: 100
  };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 250
  });

  // これはレスポンスが良くない
  // const [filteredImgParams, setFilteredImgParams] = useState<ImgParamsItems>(
  //   []
  // );
  // useEffect(() => {
  //   setFilteredImgParams(
  //     searchText
  //       ? imgUrlParams.filter((v) => imgParasmItemInclude(v, searchText))
  //       : imgUrlParams
  //   );
  // }, [searchText]);

  return (
    <Layout title="Render">
      <Box
        position="fixed"
        top={0}
        // left={0}
        // right={0}
        style={{
          width: '100%', // dialog が表示されてスクロールバーが消えると右へズレる
          // height: trigger ? 200 : 0,
          // maxHeight: 10,
          zIndex: theme.zIndex.appBar
        }}
      >
        <Fade in={mdDown && trigger} timeout={{ enter: 700 }}>
          <Paper
            square
            style={{
              position: 'fixed',
              top: 0,
              width: '100%',
              height: 100,
              padding: mdDown && trigger ? theme.spacing(1) : 0
            }}
          >
            {mdDown && trigger && (
              <Box style={{ height: 100 }}>
                <ImgPreview
                  previewUrl={previewUrl}
                  {...imgPreviewThumbProps}
                  onSize={({ w, h }) => {
                    setImgWidth(w);
                    setImgHeight(h);
                  }}
                  onFileSize={({ imgFileSize }) => {
                    setImgFileSize(imgFileSize);
                  }}
                />
              </Box>
            )}
          </Paper>
        </Fade>
      </Box>
      <Container className={classes.container}>
        <Box className={classes.root}>
          <Box className={classes.imagePanel}>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              className={classes.imgPreviewOuter}
            >
              <Box className={classes.imgPreviewFixLgUp}>
                <Box p={1} className={classes.imageHeaderOuter}>
                  <Box flexGrow="1">
                    <Typography variant="body1" color="textPrimary">
                      {imgFileSize === 0 ? (
                        <Skeleton variant="rect" width="8em" />
                      ) : (
                        imageTitleInfo({
                          ...getPreviewSize(),
                          imgFileSize
                        })
                      )}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="textPrimary">
                      Open Image:
                    </Typography>
                    <Button
                      component={Link}
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      disableElevation={true}
                    >
                      <OpenInNewIcon color="action" />
                    </Button>
                  </Box>
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
                      QR code
                    </Button>
                  </Box>
                </Box>
                <Collapse in={qrOpened}>
                  <Box display="flex" justifyContent="flex-end">
                    <FragmentLinkQRcode url={previewUrl} />
                  </Box>
                </Collapse>
                <Fade
                  in={!(mdDown && trigger)}
                  timeout={{ enter: 700 }}
                  style={{ flexGrow: 1 }}
                >
                  <Box className="ImagePreviewOuter">
                    <ImgPreview
                      position={mdDown && trigger ? 'fixed' : 'static'}
                      previewUrl={previewUrl}
                      {...imgPreviewProps}
                      onSize={({ w, h }) => {
                        setImgWidth(w);
                        setImgHeight(h);
                      }}
                      onFileSize={({ imgFileSize }) => {
                        setImgFileSize(imgFileSize);
                      }}
                    />
                  </Box>
                </Fade>
              </Box>
            </Box>
          </Box>
          <Box
            mt={2}
            p={1}
            flexGrow={1}
            style={{ maxWidth: theme.breakpoints.values.sm }}
          >
            <Box mb={1}>
              <DebTextField
                placeholder="search"
                fullWidth
                value={searchText}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChangeValue={({ value }) => setSearchText(value)}
              />
            </Box>
            <Box>
              <ImgUrl
                paramsItem={
                  searchText
                    ? imgUrlParams.filter((v) =>
                        imgParasmItemInclude(v, searchText)
                      )
                    : imgUrlParams
                }
                categorize={searchText ? false : true}
                imageRawUrl={imageRawUrl}
                onChangePreviewUrl={({ value }) => {
                  // console.log(value);
                  setPreviewUrl(value);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default RenderPage;
