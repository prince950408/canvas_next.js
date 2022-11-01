import React, { useCallback, useRef, useEffect, useReducer } from 'react';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

type previewImgState = {
  state: 'loading' | 'done' | 'err';
  skeleton: boolean | 'once';
  loadingUrl: string;
  previewUrl: string;
  imgWidth: number;
  imgHeight: number;
  imgFileSize: number;
  width: number;
  height: number;
};

const initialState: previewImgState = {
  state: 'done',
  skeleton: false,
  loadingUrl: '',
  previewUrl: '',
  imgWidth: 0,
  imgHeight: 0,
  imgFileSize: 0,
  width: 0,
  height: 0
};

type actSetSizeType = {
  type: 'setImgSize' | 'setSize';
  payload: [number, number];
};
type actSetFileSizeType = {
  type: 'setImgFileSize';
  payload: [number];
};
type actType =
  | {
      type: 'setUrl' | 'setSize' | 'loading' | 'done' | 'err';
      payload: [string];
    }
  | actSetSizeType
  | actSetFileSizeType;
function reducer(state: previewImgState, action: actType): previewImgState {
  const newState: previewImgState = { ...state };
  switch (action.type) {
    case 'setUrl':
      newState.loadingUrl = action.payload[0];
      if (newState.loadingUrl && newState.loadingUrl !== state.loadingUrl) {
        newState.state = 'loading';
      }
      break;
    case 'setImgSize':
      newState.imgWidth = action.payload[0] as number;
      newState.imgHeight = action.payload[1] as number;
      break;
    case 'setSize':
      newState.width = action.payload[0] as number;
      newState.height = action.payload[1] as number;
      break;
    case 'setImgFileSize':
      if (state.state === 'done') {
        newState.imgFileSize = action.payload[0] as number;
      }
      break;
    case 'loading':
      if (newState.loadingUrl) {
        newState.state = 'loading';
      }
      break;
    case 'done':
      newState.state = 'done';
      if (state.skeleton === 'once') {
        newState.skeleton = false;
      }
      newState.previewUrl = state.loadingUrl;
      break;
    case 'err':
      newState.state = 'err';
      if (state.skeleton === 'once') {
        newState.skeleton = false;
      }
      break;
  }
  return newState;
}

export type ImgPreviewFitMode = 'landscape' | 'portrait';
export type ImgPreviewImgGrow = 'none' | 'fit' | 'y';
export type ImgPreviewProps = {
  previewUrl: string;
  fitMode: ImgPreviewFitMode;
  imgGrow: ImgPreviewImgGrow;
  position?: string;
  top?: number | string; // 必要なものだけ
  initImgWidth?: number;
  initImgHeight?: number;
  width?: number;
  height?: number;
  skeleton?: boolean | 'once';
  onSize?: ({ w, h }: { w: number; h: number }) => void;
  onFileSize?: ({ imgFileSize }: { imgFileSize: number }) => void;
};

export default function ImgPreview({
  previewUrl,
  fitMode = 'landscape',
  imgGrow = 'fit',
  position,
  top,
  initImgWidth = 0,
  initImgHeight = 0,
  width,
  height,
  skeleton = false,
  onSize = (_e) => {},
  onFileSize = (_e) => {}
}: ImgPreviewProps) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const newState = { ...init };
    newState.loadingUrl = previewUrl;
    newState.state = 'loading';
    newState.skeleton = skeleton;
    newState.imgWidth = initImgWidth;
    newState.imgHeight = initImgHeight;
    // setTimeout(() => dispatch({ type: 'setUrl', payload: [previewUrl] }), 1); // dispatch でないと即時反映されない?
    return newState;
  });
  const outerEl = useRef<HTMLDivElement | null>(null);

  const getElementFittingSize = useCallback(
    (imgWidth: number, imgHeight: number): [number, number] => {
      const { width: outerWidth = 0, height: outerHeight = 0 } =
        outerEl.current?.getBoundingClientRect() || {};
      let w = outerWidth;
      let h = outerHeight;
      if (imgGrow === 'none' && imgWidth <= w && imgHeight <= outerHeight) {
        w = imgWidth;
        h = imgHeight;
      } else {
        if (fitMode === 'landscape') {
          w = outerWidth;
          h = (imgHeight * outerWidth) / imgWidth;
        } else {
          w = (imgWidth * outerHeight) / imgHeight;
          h = outerHeight;
        }
        if (imgGrow === 'fit' && w > outerWidth) {
          h = (h * outerWidth) / w;
          w = outerWidth;
        } else if (imgGrow !== 'y' && h > outerHeight) {
          w = (w * outerHeight) / h;
          h = outerHeight;
        }
      }
      return [w, h];
    },
    [outerEl, fitMode, imgGrow]
  );

  useEffect(() => {
    if (
      state.state === 'loading' &&
      state.skeleton === 'once' &&
      state.imgWidth > 0
    ) {
      dispatch({
        type: 'setSize',
        payload: getElementFittingSize(state.imgWidth, state.imgHeight)
      });
    }
  }, [
    getElementFittingSize,
    state.state,
    state.skeleton,
    state.imgWidth,
    state.imgHeight
  ]);

  useEffect(() => {
    dispatch({ type: 'setUrl', payload: [previewUrl] });
    if (previewUrl) {
      const img = new Image();
      const handleLoad = (e: Event) => {
        if (e.target) {
          // img.filesize は undefined
          // https://stackoverflow.com/questions/1310378/determining-image-file-size-dimensions-via-javascript
          // https://stackoverflow.com/questions/20907523/how-do-you-get-the-file-size-of-an-image-on-the-web-page-with-javascript
          // これは動かなかった https://stackoverflow.com/questions/28430115/javascript-get-size-in-bytes-from-html-img-src/45409613
          // disk cache を使うはずだから転送は発生しないとは思うが、
          // width x height 含めて api を準備してサーバー側で処理することも検討か?:
          fetch(previewUrl)
            .then(
              (response) => response.blob(),
              (err) => dispatch({ type: 'err', payload: [err] })
            )
            .then((data) => {
              if (data) {
                dispatch({
                  type: 'setImgSize',
                  payload: [img.width, img.height]
                });
                dispatch({
                  type: 'setSize',
                  payload: getElementFittingSize(img.width, img.height)
                });
                dispatch({ type: 'done', payload: [''] });
                dispatch({ type: 'setImgFileSize', payload: [data.size] });
              }
            });
        }
      };
      img.addEventListener('load', handleLoad);
      img.src = previewUrl;
      // 階層が深い位置にあるのが気になる
      return () => {
        img.removeEventListener('load', handleLoad);
      };
    } else {
      dispatch({ type: 'setImgSize', payload: [0, 0] });
      dispatch({ type: 'setSize', payload: [0, 0] });
      dispatch({ type: 'done', payload: [''] });
      dispatch({ type: 'setImgFileSize', payload: [0] });
    }
  }, [previewUrl, getElementFittingSize, width, height, outerEl]);

  useEffect(() => {
    onSize({ w: state.imgWidth, h: state.imgHeight });
  }, [onSize, state.imgWidth, state.imgHeight]);

  useEffect(() => {
    onFileSize({ imgFileSize: state.imgFileSize });
  }, [onFileSize, state.imgFileSize]);

  return (
    <Box width={'100%'} height={height || '100%'} position={position} top={top}>
      <div
        ref={outerEl}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        {state.skeleton && state.state === 'loading' ? (
          <Skeleton
            variant="rect"
            width={state.width > 0 ? state.width : '100%'}
            height={state.height > 0 ? state.height : '100%'}
          />
        ) : (
          <Box>
            <Box display="flex" justifyContent="center" width="100%">
              <img
                src={state.previewUrl}
                width={state.width}
                height={state.height}
                alt=""
                onError={() => {
                  dispatch({ type: 'err', payload: [''] });
                }}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              style={{
                position: 'relative',
                bottom: 4,
                marginBottom: state.state === 'loading' ? -4 : 0,
                opacity: 0.5
              }}
            >
              {state.state === 'loading' && (
                <LinearProgress style={{ width: state.width }} />
              )}
            </Box>
          </Box>
        )}
      </div>
    </Box>
  );
}
