import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import format from 'rehype-format';
import rehypeSanitize from 'rehype-sanitize';
import PreviewContext, {
  PreviewDispatch,
  getTargetItemIndex,
  allMatchAspectRatio
} from '../components/PreviewContext';
import { breakPointValue } from '../utils/intermediate';
import DebTextField from '../components/DebTextField';
import FragmentCodePanel from '../components/FragmentCodePannel';
import { ImgParamsValues } from '../utils/imgParamsUtils';
import merge from 'deepmerge';
import gh from 'hast-util-sanitize/lib/github.json';
import { Schema } from 'hast-util-sanitize';
import CodePenDefineForm from '../components/CodePen';
import TryItOn from '../components/TryItOn';

const schema = merge(gh, {
  tagNames: ['picture', 'source'],
  attributes: { source: ['srcSet', 'sizes'], img: ['srcSet', 'sizes'] }
});
const processorHtml = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, (schema as unknown) as Schema)
  .use(format)
  .use(rehypeStringify)
  .freeze();

const FragmentImgTag = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);

  const [defaultItem, setDefaultItem] = useState<{
    itemKey: string;
    previewUrl: string;
    imageParams: ImgParamsValues;
    imgWidth: number;
    imgHeight: number;
  }>({
    itemKey: '',
    previewUrl: '',
    imageParams: [],
    imgWidth: 0,
    imgHeight: 0
  });

  const [altText, setAltText] = useState(
    previewStateContext.tagFragment.altText
  );
  const [linkText, setLinkText] = useState(
    previewStateContext.tagFragment.linkText
  );
  const [asThumb, setAsThumb] = useState(
    previewStateContext.tagFragment.asThumb
  );
  const [newTab, setNewTab] = useState(previewStateContext.tagFragment.newTab);
  const [srcsetDescriptor, setSrcsetDescriptor] = useState(
    previewStateContext.tagFragment.srcsetDescriptor
  );
  const [disableWidthHeight, setDisableWidthHeight] = useState(
    previewStateContext.tagFragment.disableWidthHeight
  );
  const [imgHtml, setImgHtml] = useState('');

  useEffect(() => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.defaultTargetKey
    );
    if (idx >= 0) {
      setDefaultItem({
        itemKey: previewStateContext.defaultTargetKey,
        previewUrl: previewStateContext.previewSet[idx].previewUrl,
        imageParams: previewStateContext.previewSet[idx].imageParams,
        imgWidth: previewStateContext.previewSet[idx].imgWidth,
        imgHeight: previewStateContext.previewSet[idx].imgHeight
      });
    }
  }, [previewStateContext.previewSet, previewStateContext.defaultTargetKey]);

  useEffect(() => {
    const preViewSetWithoutDefault = previewStateContext.previewSet.filter(
      ({ itemKey }) => itemKey !== defaultItem.itemKey
    );
    const dpr =
      srcsetDescriptor !== 'w' &&
      preViewSetWithoutDefault.some(
        ({ imgDispDensity }) => imgDispDensity !== 1
      );

    const srcSet: string[] = preViewSetWithoutDefault.map(
      ({ previewUrl, imgWidth, imgDispDensity }) =>
        dpr ? `${previewUrl} ${imgDispDensity}x` : `${previewUrl} ${imgWidth}w`
    );
    const sizes: string[] = preViewSetWithoutDefault.map(
      ({ imgWidth, media }) =>
        `(min-width: ${breakPointValue(media, imgWidth)}px) ${imgWidth}px`
    );
    const addAttrWidthHeigth =
      !disableWidthHeight &&
      allMatchAspectRatio(previewStateContext.previewSet);
    const imgElement = (
      <img
        src={defaultItem.previewUrl}
        srcSet={srcSet.length > 0 ? srcSet.join(', ') : undefined}
        sizes={!dpr && sizes.length > 0 ? sizes.join(', ') : undefined}
        alt={altText}
        width={addAttrWidthHeigth ? defaultItem.imgWidth : undefined}
        height={addAttrWidthHeigth ? defaultItem.imgHeight : undefined}
      />
    );
    const t = newTab
      ? {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      : {};
    const elm = linkText ? (
      <a href={linkText} {...t}>
        {imgElement}
      </a>
    ) : asThumb ? (
      <a href={defaultItem.previewUrl.split('?', 2)[0]} {...t}>
        {imgElement}
      </a>
    ) : (
      imgElement
    );
    const html = ReactDomServer.renderToStaticMarkup(elm);
    processorHtml.process(html, (err, file) => {
      if (err) {
        console.error(err);
      }
      setImgHtml(String(file));
    });
  }, [
    previewStateContext.previewSet,
    srcsetDescriptor,
    defaultItem,
    altText,
    linkText,
    asThumb,
    newTab,
    disableWidthHeight
  ]);

  useEffect(() => {
    setSrcsetDescriptor(previewStateContext.tagFragment.srcsetDescriptor);
  }, [previewStateContext.tagFragment.srcsetDescriptor]);
  useEffect(() => {
    setDisableWidthHeight(previewStateContext.tagFragment.disableWidthHeight);
  }, [previewStateContext.tagFragment.disableWidthHeight]);
  useEffect(() => {
    previewDispatch({
      type: 'setTagFragment',
      payload: [
        altText,
        linkText,
        asThumb,
        newTab,
        srcsetDescriptor,
        disableWidthHeight
      ]
    });
  }, [
    previewDispatch,
    altText,
    linkText,
    asThumb,
    newTab,
    srcsetDescriptor,
    disableWidthHeight
  ]);

  return (
    <Box mx={1}>
      <Box p={1}>
        <TryItOn
          title="CodePen"
          linkButtons={[
            <CodePenDefineForm
              title="img tag"
              html={imgHtml}
              buttonLabel={'img tag'}
              buttonProps={{
                color: 'primary',
                variant: 'contained',
                disableElevation: true,
                endIcon: <OpenInNewIcon />
              }}
            />
          ]}
        />
      </Box>
      <Box p={1} mb={2}>
        <Box px={2} mb={2} width="100%">
          <DebTextField
            label="alt text"
            fullWidth
            value={altText}
            onChangeValue={({ value }) => setAltText(value)}
          />
        </Box>
        <Box px={2} mt={3} display="flex" flexDirection="row">
          <Box flexGrow={1} mr={1}>
            <DebTextField
              label="link"
              fullWidth
              value={linkText}
              onChangeValue={({ value }) => setLinkText(value)}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Box my={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={asThumb}
                    //defaultChecked={asThumb}
                    onChange={(e) => {
                      setAsThumb(e.target.checked);
                    }}
                    color="primary"
                    name="asThumb"
                    inputProps={{
                      'aria-label': `switch image as thumbnail`
                    }}
                  />
                }
                label="as thumbnail"
              />
            </Box>
            <Box my={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newTab}
                    onChange={(e) => {
                      setNewTab(e.target.checked);
                    }}
                    color="primary"
                    name="newTab"
                    inputProps={{
                      'aria-label': `switch open link in new tab`
                    }}
                  />
                }
                label="new tab"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mx={2} p={1}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography color="textSecondary">srcset descriptor</Typography>
          </FormLabel>
          <RadioGroup
            aria-label="srcset descriptor"
            name="descriptor"
            value={srcsetDescriptor}
            onChange={(e) => {
              if (
                e.target.value === 'auto' ||
                e.target.value === 'w' ||
                e.target.value === 'x'
              ) {
                setSrcsetDescriptor(e.target.value);
              }
            }}
          >
            <Box>
              <FormControlLabel
                value="auto"
                control={<Radio color="default" />}
                label="Auto"
              />
              <FormControlLabel
                value="w"
                control={<Radio color="default" />}
                label="w"
              />
              <FormControlLabel
                value="x"
                control={<Radio color="default" />}
                label="x"
              />
            </Box>
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mx={2} p={1}>
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
                name="disableWidthHeight"
              />
            }
            label="Disable"
          />
        </FormControl>
      </Box>
      <Box>
        <Box p={1}>
          <FragmentCodePanel
            naked
            label="img tag source code"
            value={imgHtml}
            language="html"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FragmentImgTag;
