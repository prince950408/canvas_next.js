import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { dirname, join } from 'path';
import { encodeBase64Url } from '../utils/base64';
import Validator from '../utils/validator';
import PreviewContext, {
  CardType,
  PreviewDispatch,
  getTargetItemIndex
} from '../components/PreviewContext';
import DebTextField from '../components/DebTextField';
import FragmentCodePanel from '../components/FragmentCodePannel';
import ImgPreview from '../components/ImgPreview';
import Link from '../components/Link';
import TryItOn from '../components/TryItOn';
import copyTextToClipboard from '../utils/clipboard';
import { useSnackbar } from 'notistack';

const validator = Validator();

const useStyles = makeStyles((theme) => ({
  imagePreview: {
    width: 300,
    height: 150,
    [theme.breakpoints.up('sm')]: {
      width: 438,
      height: 220
    },
    '& > .MuiBox-root': {
      width: 300,
      height: 150,
      [theme.breakpoints.up('sm')]: {
        width: 438,
        height: 220
      }
    }
  }
}));

const cardTypeList: { label: string; cardType: CardType }[] = [
  { label: 'summary', cardType: 'summary' },
  { label: 'summary large image', cardType: 'summary_large_image' }
];

const FragmentCard = () => {
  const classes = useStyles();
  //const router = useRouter();
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const getPreviewUrl = useCallback(() => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.editTargetKey
    );
    return idx >= 0 ? previewStateContext.previewSet[idx].previewUrl : '';
  }, [previewStateContext.previewSet, previewStateContext.editTargetKey]);
  const [imageUrl] = useState(
    getPreviewUrl() // assets のチェックが入らない状態になる. あとで対応
  );
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const [copied, setCopied] = useState(false);

  const [cardType, setCardType] = useState(previewStateContext.card.cardType);
  const [title, setTitle] = useState(previewStateContext.card.title);
  const [description, setDescription] = useState(
    previewStateContext.card.description
  );
  const [cardPreviewUrl, setCardPreviewUrl] = useState('');

  const validateImageUrl = useCallback(() => {
    const err = validator.assets(
      imageUrl,
      previewStateContext.validateAssets,
      previewStateContext.assets,
      true
    );
    if (err && imageUrl !== '') {
      return err.message;
    }
    return '';
  }, [
    previewStateContext.validateAssets,
    previewStateContext.assets,
    imageUrl
  ]);

  const handleListItemClick = (cardType: CardType) => {
    setCardType(cardType);
  };

  useEffect(() => {
    if (imageUrl && validateImageUrl() === '') {
      const q = new URLSearchParams('');
      q.append('cardType', encodeBase64Url(cardType));
      q.append('imageUrl', encodeBase64Url(imageUrl));
      q.append('title', encodeBase64Url(title));
      q.append('description', encodeBase64Url(description));
      try {
        const u = new URL(window.location.href);
        u.pathname = join(dirname(u.pathname), 'card_gen');
        setCardPreviewUrl(`${u.toString().split('?', 1)[0]}?${q.toString()}`);
      } catch {
        setCardPreviewUrl('');
      }
    } else {
      setCardPreviewUrl('');
    }
  }, [imageUrl, cardType, title, description, validateImageUrl]);

  useEffect(() => {
    if (validateImageUrl() === '') {
      previewDispatch({
        type: 'setPreviewImageUrl',
        payload: [imageUrl]
      });
    }
  }, [previewDispatch, imageUrl, validateImageUrl]);

  useEffect(() => {
    previewDispatch({
      type: 'setCard',
      payload: [cardType, title, description]
    });
  }, [previewDispatch, cardType, title, description]);

  return (
    <Box mx={1}>
      <Box p={1}>
        <TryItOn
          title="Twitter Card Validator"
          linkButtons={[
            <Button
              color="primary"
              disableElevation={true}
              className="MuiButton-containedPrimary"
              endIcon={<FileCopyOutlinedIcon />}
              onClick={() => {
                copyTextToClipboard(cardPreviewUrl).then(
                  () => {
                    setCopied(true);
                    setTimeout(
                      () =>
                        enqueueSnackbar('The Card URL has been copied.', {
                          variant: 'success'
                        }),
                      copied ? 1 : 1000
                    );
                  },
                  (err) => {
                    enqueueSnackbar(
                      `error in cpoing the Card URL: ${err.message} `,
                      {
                        variant: 'error'
                      }
                    );
                  }
                );
              }}
            >
              <Box>Copy Card URL</Box>
            </Button>,
            <Zoom in={copied}>
              <Button
                component={Link}
                color="primary"
                href="https://cards-dev.twitter.com/validator"
                target="_blank"
                rel="noopener noreferrer"
                disableElevation={true}
                className="MuiButton-containedPrimary"
                endIcon={<OpenInNewIcon />}
              >
                Open Card Validator
              </Button>
            </Zoom>
          ]}
        />
      </Box>
      <Box p={1} mb={2}>
        <Accordion
          elevation={0}
          // expanded={groupName === opened}
          // onChange={onChange}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`optional parameters panel`}
            IconButtonProps={{ edge: 'start' }}
          >
            <Typography variant="body1">Optional fields</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box width="100%">
              <Box p={1}>
                <DebTextField
                  id="preview-card-title"
                  label="Preview Card Title"
                  // defaultValue={data.cardTitle}
                  fullWidth
                  value={title}
                  onChangeValue={({ value }) => {
                    setTitle(value);
                  }}
                />
              </Box>
              <Box p={1}>
                <DebTextField
                  id="preview-card-description"
                  label="Preview Card Description"
                  // defaultValue={data.cardDescription}
                  fullWidth
                  value={description}
                  onChangeValue={({ value }) => {
                    setDescription(value);
                  }}
                />
              </Box>
              <Box mt={2} p={1}>
                <Typography variant="body1" color="textSecondary">
                  Preview Card Type
                </Typography>
                <Box p={1}>
                  <List component="nav" aria-label="main mailbox folders">
                    {cardTypeList.map((v) => (
                      <ListItem
                        key={v.cardType}
                        button
                        onClick={() => handleListItemClick(v.cardType)}
                      >
                        <ListItemIcon>
                          {cardType === v.cardType && <CheckIcon />}
                        </ListItemIcon>
                        <ListItemText primary={v.label} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box my={1} p={1}>
        <FragmentCodePanel
          id="card-preview-url"
          summary={
            <Card elevation={0}>
              <CardHeader
                titleTypographyProps={{ variant: 'body2' }}
                title={
                  <Box display="flex">
                    <Box>
                      <Typography variant="body2">Image for Card</Typography>
                    </Box>
                    <Box ml={1}>
                      <Typography variant="body2">
                        {imgWidth > 0 ? `(${imgWidth} x ${imgHeight})` : ''}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <CardActionArea
                className={classes.imagePreview}
                onClick={() => {
                  router.push('/render');
                }}
              >
                <Box>
                  <ImgPreview
                    previewUrl={imageUrl}
                    {...{
                      fitMode: 'landscape',
                      imgGrow: 'none',
                      width: undefined,
                      height: undefined
                    }}
                    skeleton={true}
                    onSize={({ w, h }) => {
                      setImgWidth(w);
                      setImgHeight(h);
                    }}
                  />
                </Box>
              </CardActionArea>
            </Card>
          }
          label="Image URL"
          value={imageUrl}
        />
      </Box>
      <Box m={1} p={1}></Box>
    </Box>
  );
};

export default FragmentCard;
