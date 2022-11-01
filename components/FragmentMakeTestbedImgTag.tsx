import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import format from 'rehype-format';
import rehypeSanitize from 'rehype-sanitize';
import PreviewContext, {
  getTargetItemIndex,
  allMatchAspectRatio,
  PreviewDispatch
} from '../components/PreviewContext';
import { breakPointValue } from '../utils/intermediate';
import FragmentCodePanel from '../components/FragmentCodePannel';
import { ImgParamsValues } from '../utils/imgParamsUtils';
import merge from 'deepmerge';
import gh from 'hast-util-sanitize/lib/github.json';
import { Schema } from 'hast-util-sanitize';
import CodePenDefineForm from '../components/CodePen';
import TryItOn from '../components/TryItOn';

const schema = merge(gh, {
  tagNames: ['picture', 'source'],
  attributes: {
    source: ['srcSet', 'sizes'],
    img: ['srcSet', 'sizes'],
    div: ['dataPd']
  }
});
const processorHtml = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, (schema as unknown) as Schema)
  .use(format)
  .use(rehypeStringify)
  .freeze();

const FragmentMakeTestbedImgTag = () => {
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
    const descriptors: string[] = srcSet.map((v) => v.split('?', 2)[1]);

    const sizes: string[] = preViewSetWithoutDefault.map(
      ({ imgWidth, media }) =>
        `(min-width: ${breakPointValue(media, imgWidth)}px) ${imgWidth}px`
    );
    const addAttrWidthHeigth =
      !disableWidthHeight &&
      allMatchAspectRatio(previewStateContext.previewSet);
    const imgElement = (
      <div>
        <div>
          <p id="drp" />
        </div>
        <div id="param" data-pd={JSON.stringify(descriptors)} />
        <img
          src={defaultItem.previewUrl}
          srcSet={srcSet.length > 0 ? srcSet.join(', ') : undefined}
          sizes={!dpr && sizes.length > 0 ? sizes.join(', ') : undefined}
          alt="preview in playground"
          width={addAttrWidthHeigth ? defaultItem.imgWidth : undefined}
          height={addAttrWidthHeigth ? defaultItem.imgHeight : undefined}
        />
      </div>
    );
    const html = ReactDomServer.renderToStaticMarkup(imgElement);
    processorHtml.process(html, (err, file) => {
      if (err) {
        console.error(err);
      }
      setImgHtml(
        `<form>
  Enter another image url: <input id="imgurl" />
  <button type="submit" id="run">run</button>
</form>` + String(file)
      );
    });
  }, [
    previewStateContext.previewSet,
    srcsetDescriptor,
    defaultItem,
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
        previewStateContext.tagFragment.altText,
        previewStateContext.tagFragment.linkText,
        previewStateContext.tagFragment.asThumb,
        previewStateContext.tagFragment.newTab,
        srcsetDescriptor,
        disableWidthHeight
      ]
    });
  }, [
    previewDispatch,
    previewStateContext.tagFragment.altText,
    previewStateContext.tagFragment.linkText,
    previewStateContext.tagFragment.asThumb,
    previewStateContext.tagFragment.newTab,
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
              title="testbed (img tag)"
              html={imgHtml}
              js={`
              document.querySelector("#user-content-drp").innerText=\`device pixel ratio=\${window.devicePixelRatio}\`
              const imgurl = document.querySelector("#imgurl");
              const param = document.querySelector("#user-content-param");
              console.log(param.dataset.pd);
              const pd = JSON.parse(param.dataset.pd);
              const img = document.querySelector("img");
              const imgParams = img.src.split("?", 2)[1];
              const run = (e) => {
                const u = imgurl.value.split("?", 1)[0];
                console.log(pd);
                const s = pd.map((v) => \`\${u}?\${v}\`);
                img.srcset = s.join(", ");
                img.src = \`\${u}?\${imgParams}\`;
                e.preventDefault();
              };
              document.querySelector("form").onsubmit = run;
`}
              buttonLabel={'make'}
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
            <Box p={1}>
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
            label="img tag source code:"
            value={imgHtml}
            language="html"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FragmentMakeTestbedImgTag;
