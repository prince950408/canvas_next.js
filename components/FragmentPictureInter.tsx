import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import PreviewContext, {
  PreviewDispatch,
  getTargetItemIndex,
  PreviewItem,
  imgWidthCss,
  allMatchAspectRatio
} from '../components/PreviewContext';
import {
  BreakPoint,
  PictureNode,
  breakPointValue
} from '../utils/intermediate';
import DebTextField from '../components/DebTextField';
import FragmentCodePanel from '../components/FragmentCodePannel';
import { ImgParamsValues, imgUrlParamsToString } from '../utils/imgParamsUtils';

const FragmentPictureInter = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);

  const [defaultItem, setDefaultItem] = useState<{
    itemKey: string;
    previewUrl: string;
    baseImageUrl: string;
    imageParams: ImgParamsValues;
    imgWidth: number;
    imgHeight: number;
    media: BreakPoint;
  }>({
    itemKey: '',
    previewUrl: '',
    baseImageUrl: '',
    imageParams: [],
    imgWidth: 0,
    imgHeight: 0,
    media: 'auto'
  });

  const [altText, setAltText] = useState(
    previewStateContext.tagFragment.altText
  );
  const [disableWidthHeight, setDisableWidthHeight] = useState(
    previewStateContext.tagFragment.disableWidthHeight
  );
  const [pictureHtml, setPictureHtml] = useState('');

  useEffect(() => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.defaultTargetKey
    );
    if (idx >= 0) {
      setDefaultItem({
        itemKey: previewStateContext.defaultTargetKey,
        previewUrl: previewStateContext.previewSet[idx].previewUrl,
        baseImageUrl: previewStateContext.previewSet[idx].baseImageUrl,
        imageParams: previewStateContext.previewSet[idx].imageParams,
        imgWidth: previewStateContext.previewSet[idx].imgWidth,
        imgHeight: previewStateContext.previewSet[idx].imgHeight,
        media: previewStateContext.previewSet[idx].media
      });
    }
  }, [previewStateContext.previewSet, previewStateContext.defaultTargetKey]);

  useEffect(() => {
    const preViewSetWithoutDefault = previewStateContext.previewSet.filter(
      ({ itemKey }) => itemKey !== defaultItem.itemKey
    );
    const sourcesBucket: { [name: number]: PreviewItem[] } = {};
    preViewSetWithoutDefault.forEach((v) => {
      const w = imgWidthCss(v);
      if (w in sourcesBucket) {
        sourcesBucket[w].push(v);
      } else {
        sourcesBucket[w] = [v];
      }
    });
    const addAttrWidthHeigth =
      !disableWidthHeight &&
      allMatchAspectRatio(previewStateContext.previewSet);
    const paramsTo64 = (p: string) => {
      const ret: { key64: string; value64: string }[] = [];
      const params64Query = new URLSearchParams(p);
      params64Query.forEach((v, k) => {
        ret.push({ key64: k, value64: v });
      });
      return ret;
    };
    const pictureNode: PictureNode = {
      kind: 'picture',
      sources: Object.keys(sourcesBucket)
        .map((v) => parseInt(v, 10))
        .sort((a, b) => b - a)
        .map((imgWidth) => {
          return {
            kind: 'suorce',
            width: imgWidth,
            breakPoint: sourcesBucket[imgWidth][0].media,
            suggestMedia: `(min-width: ${breakPointValue(
              sourcesBucket[imgWidth][0].media,
              imgWidthCss(sourcesBucket[imgWidth][0])
            )}px)`,
            srcset: {
              kind: 'srcSet',
              descriptor: 'x',
              set: sourcesBucket[imgWidth].map(
                ({
                  baseImageUrl,
                  imageParams,
                  imgWidth,
                  imgHeight,
                  imgDispDensity
                }) => ({
                  src: {
                    kind: 'src',
                    url: {
                      base: baseImageUrl,
                      params: paramsTo64(imgUrlParamsToString(imageParams)),
                      paramsStr: imgUrlParamsToString(imageParams)
                    }
                  },
                  width: imgWidth,
                  height: imgHeight,
                  density: `${imgDispDensity}`
                })
              )
            }
          };
        }),
      img: {
        kind: 'img',
        alt: altText,
        src: {
          kind: 'src',
          url: {
            base: defaultItem.baseImageUrl,
            params: paramsTo64(imgUrlParamsToString(defaultItem.imageParams)),
            paramsStr: imgUrlParamsToString(defaultItem.imageParams)
          }
        },
        width: addAttrWidthHeigth ? defaultItem.imgWidth : undefined,
        height: addAttrWidthHeigth ? defaultItem.imgHeight : undefined
      }
    };
    setPictureHtml(JSON.stringify(pictureNode, null, '  '));
  }, [
    previewStateContext.previewSet,
    defaultItem,
    altText,
    disableWidthHeight
  ]);

  useEffect(() => {
    setDisableWidthHeight(previewStateContext.tagFragment.disableWidthHeight);
  }, [previewStateContext.tagFragment.disableWidthHeight]);
  useEffect(() => {
    previewDispatch({
      type: 'setTagFragment',
      payload: [
        previewStateContext.tagFragment.altText,
        previewStateContext.tagFragment.linkText,
        previewStateContext.tagFragment.asThumb,
        previewStateContext.tagFragment.newTab,
        previewStateContext.tagFragment.srcsetDescriptor,
        disableWidthHeight
      ]
    });
  }, [
    previewDispatch,
    previewStateContext.tagFragment.altText,
    previewStateContext.tagFragment.linkText,
    previewStateContext.tagFragment.asThumb,
    previewStateContext.tagFragment.newTab,
    previewStateContext.tagFragment.srcsetDescriptor,
    disableWidthHeight
  ]);

  return (
    <Box mx={1}>
      <Box p={1} mb={2}>
        <Box px={2} mb={2} width="100%">
          <DebTextField
            label="alt text"
            fullWidth
            value={altText}
            onChangeValue={({ value }) => setAltText(value)}
          />
        </Box>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography color="textSecondary">
              width / height attributes
            </Typography>
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={disableWidthHeight}
                // defaultChecked={defaultDisableWidthHeight}
                onChange={(e) => setDisableWidthHeight(e.target.checked)}
              />
            }
            label="Disable"
          />
        </FormControl>
      </Box>
      <Box>
        <Box p={1}>
          <FragmentCodePanel
            defaultOpened
            naked
            label="intermediate picture tag source code"
            value={pictureHtml}
            language="html"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FragmentPictureInter;
