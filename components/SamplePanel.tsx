import React, { useState } from 'react';
// import Link from '../components/Link';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {
  BuiltinSampleImages,
  SampleImageBuildParametersSet,
  SampleImageCredit,
  SampleImage
} from '../src/sample';
import {
  imgUrlParamsMergeObject,
  imgUrlParamsToString
} from '../utils/imgParamsUtils';

function Creadit({ credit }: { credit?: SampleImageCredit }) {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
  };
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          interactive
          title={
            <React.Fragment>
              <Box py={1}>
                <Typography variant="body1">
                  Author: {(credit?.author || []).join(', ')}
                </Typography>
              </Box>
              {credit?.license !== undefined && (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  pb={1}
                >
                  <Typography variant="body1">
                    License: {`${credit.license.fullName || credit.license.id}`}
                  </Typography>
                  {credit.license.url !== undefined && (
                    <Box px={1}>
                      <a
                        href={credit.license.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewIcon
                          style={{
                            color: theme.palette.info.main
                          }}
                        />
                      </a>
                    </Box>
                  )}
                </Box>
              )}
              {credit?.webPage !== undefined && (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  pb={1}
                >
                  <Typography variant="body1">Web Page: </Typography>
                  <Box px={1}>
                    <a
                      href={credit.webPage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon
                        style={{
                          color: theme.palette.info.main
                        }}
                      />
                    </a>
                  </Box>
                </Box>
              )}
            </React.Fragment>
          }
        >
          <IconButton
            aria-label="license"
            disabled={credit === undefined}
            onClick={handleTooltipOpen}
            style={{ padding: 0, margin: 0 }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

type Props = {
  onSelect: ({ value }: { value: string }) => void;
};

function SampleItem({
  sampleImage,
  onSelect
}: { sampleImage: SampleImage } & Props) {
  const q = imgUrlParamsMergeObject(
    [],
    SampleImageBuildParametersSet[0].parameters
  );
  const s = imgUrlParamsToString(q);
  const paramsString = s ? `?${s}` : '';

  return (
    <Box px={1}>
      <Card elevation={0}>
        <CardActionArea
          onClick={() => {
            // setImageBaseUrl(v.imageUrl);
            onSelect({ value: sampleImage.imageUrl });
          }}
        >
          <CardMedia
            image={`${sampleImage.imageUrl}${paramsString}`}
            title={sampleImage.title}
            style={{ width: 160, height: 80 }}
          />
        </CardActionArea>
        <CardActions>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ width: '100%', maxWidth: 160 }}
            m={0}
            p={0}
          >
            <Box flexGrow="1">
              <Typography variant="caption" noWrap={true}>
                {sampleImage.title}
              </Typography>
            </Box>
            <Box>
              <Creadit credit={sampleImage.credit} />
            </Box>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}

const SamplePanel = ({ onSelect }: Props) => {
  return (
    <Box display="flex" flexDirection="row" overflow="auto">
      {BuiltinSampleImages.map((v, idx) => (
        <Box key={idx}>
          <SampleItem sampleImage={v} onSelect={(e) => onSelect(e)} />
        </Box>
      ))}
    </Box>
  );
};

export default SamplePanel;
