import React, { useReducer, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../components/Link';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ImgParams, {
  ImgUrlParamsOnChangeEvent,
  ImgParamsEnabled
} from '../components/ImgParams';
import {
  imgUrlParamsParseString,
  ImgParamsItems,
  imgParamsCategories,
  imgParamsInCategory,
  imgUrlParamsToString,
  paramsKeyParameters
} from '../utils/imgParamsUtils';

const useStyles = makeStyles((theme) => ({
  paramRow: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  },
  infoButtonOuter: {
    '& .MuiButton-root': {
      minWidth: 0
    }
  }
}));

type CategoryPanelProps = {
  category: string;
  opened: string;
  categorize: boolean;
  children: React.ReactNode;
  onChange: (_e: React.ChangeEvent<{}>, isExpanded: boolean) => void;
};
function CategoryPanel({
  category,
  opened,
  categorize,
  children,
  onChange
}: CategoryPanelProps) {
  if (categorize) {
    return (
      <Accordion
        elevation={0}
        key={`category-${category}`}
        expanded={category === opened}
        onChange={onChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`category panel : ${category}`}
          id={`category-${category}`}
          IconButtonProps={{ edge: 'end' }}
        >
          {`${category}`}
        </AccordionSummary>
        <AccordionDetails style={{ padding: 0 }}>{children}</AccordionDetails>
      </Accordion>
    );
  } else {
    return <div>{children}</div>;
  }
}

type previewUrlStateParam = {
  enabled: boolean;
  key: string;
  value: string;
};

type previewUrlState = {
  previewUrl: string;
  baseUrl: string;
  params: previewUrlStateParam[];
};

const initialState: previewUrlState = {
  previewUrl: '',
  baseUrl: '',
  params: []
};
// function initState(s: paramsState): paramsState {
//   return { ...s };
// }
// オブジェクトで型を指定しておいた方が payload の型を拘束できるのだが、
// debouce する関数をまとめるのが難しいので今回は見送り
// type actSetParam = { type: 'setParam'; payload: [string, string] };
// type actSetImgUrl = { type: 'setImageRawUrl'; payload: string };
type actTypeInput = {
  type: 'setParam' | 'setImageRawUrl';
  payload: [string, string];
};
type actTypeEnabled = {
  type: 'setEnabled';
  payload: [string, boolean];
};
type actType = actTypeInput | actTypeEnabled;

function reducer(state: previewUrlState, action: actType): previewUrlState {
  const newState: previewUrlState = { ...state };
  switch (action.type) {
    case 'setEnabled':
    case 'setParam':
      const ak = action.payload[0];
      let replaced = false;
      const r = state.params.map(({ enabled, key, value }) => {
        if (key === ak) {
          replaced = true;
          return {
            enabled: action.type === 'setEnabled' ? action.payload[1] : enabled,
            key,
            value: action.type === 'setParam' ? action.payload[1] : value
          };
        }
        return { enabled, key, value };
      });
      if (!replaced) {
        r.push({
          enabled: action.type === 'setEnabled' ? action.payload[1] : false,
          key: ak,
          value: action.type === 'setParam' ? action.payload[1] : ''
        });
      }
      newState.params = r;
      break;
    case 'setImageRawUrl':
      const [u, p] = action.payload[0].split('?', 2);
      newState.baseUrl = u;
      if (p) {
        newState.params = imgUrlParamsParseString(p).map((v) => ({
          enabled: true,
          ...v
        }));
      } else {
        newState.params = [];
      }
      break;
    default:
      throw new Error();
  }

  const s = imgUrlParamsToString(
    newState.params
      .filter(({ enabled }) => enabled)
      .map(({ key, value }) => ({ key, value }))
  );
  const paramsString = newState.baseUrl && s ? `?${s}` : '';
  newState.previewUrl = `${newState.baseUrl}${paramsString}`;
  return newState;
}

export type ImgUrOnChangeImageUrlEvent = { value: string };
export type ImgUrOnChangePreviewUrlEvent = { value: string };
type ImgUrlProps = {
  paramsItem: ImgParamsItems;
  categorize: boolean;
  imageRawUrl: string;
  onChangeImageUrl?: (e: ImgUrOnChangePreviewUrlEvent) => void;
  onChangePreviewUrl: (e: ImgUrOnChangePreviewUrlEvent) => void;
};

export default function ImgUrl({
  paramsItem,
  categorize,
  imageRawUrl: baseUrl,
  onChangeImageUrl = (_e) => {},
  onChangePreviewUrl
}: ImgUrlProps) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const newState = { ...init };
    newState.baseUrl = baseUrl;
    newState.previewUrl = baseUrl;
    return newState;
  });

  useEffect(() => {
    // console.log(state.previewUrl);
    onChangeImageUrl({ value: state.baseUrl });
  }, [state.baseUrl, onChangeImageUrl]);

  useEffect(() => {
    // console.log(state.previewUrl);
    onChangePreviewUrl({ value: state.previewUrl });
  }, [state.previewUrl, onChangePreviewUrl]);

  const debounceInputText = (
    // debounce だけでも無くなってきたような
    act: actTypeInput['type'] | actTypeEnabled['type'],
    paramKey = ''
  ) => {
    let id: any = 0;
    return (e: ImgUrlParamsOnChangeEvent) => {
      if (id !== 0) {
        clearTimeout(id);
      }
      const value = e.value;
      id = setTimeout(
        (payload: [string, string] & [string, boolean]) => {
          dispatch({ type: act, payload: payload });
          id = 0;
        },
        1000,
        paramKey ? [paramKey, value] : [value, ''] // '' が無駄だよねぇ
      );
    };
  };

  const paramKeyIsEnabled = useCallback(
    (paramKey: string) => {
      const idx = state.params.findIndex(
        ({ enabled, key }) => key === paramKey && enabled
      );
      return idx >= 0;
    },
    [state.params]
  );

  const paramsValue = useCallback(
    (paramKey: string) => {
      const idx = state.params.findIndex(
        ({ enabled, key }) => key === paramKey && enabled
      );
      return idx >= 0 ? state.params[idx].value : '';
    },
    [state.params]
  );

  useEffect(() => {
    debounceInputText('setImageRawUrl', '')({ value: baseUrl });
  }, [baseUrl]);

  // state が１つだと map のループが回るよね?
  const [opened, setOpened] = useState('');
  const changeOpend = (category: string) => {
    return (_e: React.ChangeEvent<{}>, isExpanded: boolean): void => {
      setOpened(isExpanded ? category : '');
    };
  };

  return (
    <Box>
      {imgParamsCategories().map((v) => (
        <CategoryPanel
          key={`category-${v}`}
          category={v}
          opened={opened}
          categorize={categorize}
          onChange={changeOpend(v)}
        >
          <Box width="100%">
            {(opened === v || !categorize) &&
              imgParamsInCategory(paramsItem, v).map(
                ({ paramsKey }: { paramsKey: string }) => (
                  <Box
                    className={classes.paramRow}
                    key={paramsKey}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Box>
                      <ImgParamsEnabled
                        paramsKey={paramsKey}
                        enabled={paramKeyIsEnabled(paramsKey)}
                        onChange={debounceInputText('setEnabled', paramsKey)}
                      />
                    </Box>
                    <Box flexGrow={1}>
                      <ImgParams
                        paramsKey={paramsKey}
                        paramsValue={paramsValue(paramsKey)}
                        onChange={debounceInputText('setParam', paramsKey)}
                      />
                    </Box>
                    <Box className={classes.infoButtonOuter}>
                      {((p) => {
                        return p ? (
                          <Tooltip
                            placement="left"
                            disableFocusListener
                            disableTouchListener
                            title={
                              <Box>
                                <Typography variant="body1">
                                  {p.short_description}
                                </Typography>
                              </Box>
                            }
                          >
                            <span>
                              <Button
                                component={Link}
                                disabled={p.url ? false : true}
                                href={p.url || ''}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Typography
                                  color={p.url ? 'textSecondary' : 'inherit'}
                                >
                                  <InfoOutlinedIcon fontSize="small" />
                                </Typography>
                              </Button>
                            </span>
                          </Tooltip>
                        ) : (
                          ''
                        );
                      })(paramsKeyParameters(paramsKey))}
                    </Box>
                  </Box>
                )
              )}
          </Box>
        </CategoryPanel>
      ))}
    </Box>
  );
}
