import React from 'react';
import {
  ImgParamsValues,
  imgUrlParamsParseString,
  imgUrlParamsMergeObject,
  imgUrlParamsToString,
  imgDispDensity
} from '../utils/imgParamsUtils';
import {
  ImportTemplateParametersSet,
  ImportTemplateParameters
} from '../src/template';
import { SrcSetDescriptor, BreakPoint } from '../utils/intermediate';

export type CardType = 'summary' | 'summary_large_image';

type Card = {
  cardType: CardType;
  title: string;
  description: string;
};

type TagFragment = {
  altText: string;
  linkText: string;
  asThumb: boolean;
  newTab: boolean;
  srcsetDescriptor: SrcSetDescriptor;
  disableWidthHeight: boolean;
};

export function imgWidthCss(p: PreviewItem): number {
  // srcset のグルーピングに使うこともあるので繰り上げて揃えている.
  // TODO; グルーピングでそろわないときがないか検証.
  // TODO; 丸めない方が良い箇所がないか検討.
  return Math.ceil(p.imgWidth / p.imgDispDensity);
}
export function imgHeightCss(p: PreviewItem): number {
  return Math.ceil(p.imgHeight / p.imgDispDensity);
}

export function matchAspectRatio(p1: PreviewItem, p2: PreviewItem): boolean {
  const w1 = imgWidthCss(p1);
  const h1 = imgHeightCss(p1);
  const w2 = imgWidthCss(p2);
  const h2 = imgHeightCss(p2);
  const a1 = w1 / h1;
  const a2 = w2 / h2;
  if (a1 === a2 || a1 === a2 - 0.01 || a1 === a2 + 0.01) {
    return true;
  }
  return false;
}

export function allMatchAspectRatio(previewSet: PreviewItem[]): boolean {
  return previewSet.slice(1).every((p2) => matchAspectRatio(previewSet[0], p2));
}

export const getTargetItemIndex = (
  previewSet: PreviewItem[],
  targetKey: string
): number => previewSet.findIndex(({ itemKey }) => itemKey === targetKey);

export const isPreviewSetReady = (previewSet: PreviewItem[]): boolean =>
  previewSet.every(({ imgWidth, imgHeight }) => imgWidth > 0 && imgHeight > 0);

export const PreviewDispatch = React.createContext<React.Dispatch<actType>>(
  (_a: actType) => {}
);

export type PreviewItem = {
  itemKey: string;
  /**
   * /// @TJS-format uri は使えないぽい
   * パラメータがついてないときもある
   * /// @TJS-pattern ^https://.+\?.+$
   * @TJS-pattern ^https://.+$
   */
  previewUrl: string;
  /**
   * /// @TJS-format uri は使えないぽい
   * @TJS-pattern ^https://.+$
   */
  baseImageUrl: string;
  imageParams: ImgParamsValues;
  imgWidth: number;
  imgHeight: number;
  imgDispDensity: number;
  media: BreakPoint;
};

export type PreviewSetKind = '' | 'sample' | 'recv' | 'data';
export type PreviewSetState = '' | 'pre-init' | 'init' | 'edited';

export type PreviewContextState = {
  /**
   * @ignore
   */
  validateAssets: boolean;
  /**
   * @ignore
   */
  assets: string[];
  /**
   * @ignore
   */
  templateIdx: number;
  /**
   * /// @TJS-format uri は使えないぽい
   * @TJS-pattern ^https://.+$
   */
  imageBaseUrl: string;
  baseParameterSet: ImportTemplateParameters[];
  baseMedias: BreakPoint[];
  editTargetKey: string; // 編集対象の item を取得するときに selector がほしくなるよね(redux でなくても使える?)
  defaultTargetKey: string;
  card: Card;
  tagFragment: TagFragment;
  previewSetState: PreviewSetState;
  previewSetKind: PreviewSetKind;
  previewSet: PreviewItem[];
};

// type actTypeSetAssets = {
//   type: 'setAssets';
//   payload: [string];
// };

type actTypeResetPreviewSet = {
  type: 'resetPreviewSet';
  payload: [];
};

type actTypeImportJson = {
  type: 'importJson';
  payload: [string, string];
};

type actTypeTemplateIdx = {
  type: 'setTemplateIdx';
  payload: [number];
};

type actTypeSetImageBaseUrl = {
  type: 'setImageBaseUrl';
  payload: [PreviewSetKind, string];
};

type actTypeImportPreviewSet = {
  type: 'importPreviewSet';
  payload: [PreviewSetKind, string, ImportTemplateParametersSet, BreakPoint[]];
};

type actTypeAddPreviewImageUrl = {
  type: 'addPreviewImageUrl';
  payload: [string];
};

type actTypeSetPreviewImageUrl = {
  type: 'setPreviewImageUrl';
  payload: [string];
};

type actTypeSetPreviewImageSize = {
  type: 'setPreviewImageSize';
  payload: [string, number, number];
};

type actTypeSetPreviewImageMedia = {
  type: 'setPreviewImageMedia';
  payload: [string, BreakPoint];
};

type actTypeMergeParametersToImageUrl = {
  type: 'mergeParametersToImageUrl';
  payload: [string, ImportTemplateParametersSet, BreakPoint[]];
};

type actTypeMakeVariantImages = {
  type: 'makeVariantImages';
  payload: [string, ImportTemplateParametersSet, BreakPoint[]];
};

type actTypeClonePreviewImageUrl = {
  type: 'clonePreviewImageUrl';
  payload: [string];
};

type actTypeSetCard = {
  type: 'setCard';
  payload: [CardType, string, string];
};

type actTypeSetTagFragment = {
  type: 'setTagFragment';
  payload: [string, string, boolean, boolean, SrcSetDescriptor, boolean];
};

type actTypeSetEditTarget = {
  type: 'setEditTarget';
  payload: [string];
};

type actTypeSetDefaultTarget = {
  type: 'setDefaultTarget';
  payload: [string];
};

type actTypeRemoveFromSet = {
  type: 'removeFromSet';
  payload: [string];
};

type actTypeSortSet = {
  type: 'sortSet';
  payload: []; //order key 等はここで指定(必要になったら)
};

type actType =
  | actTypeResetPreviewSet
  | actTypeImportJson
  | actTypeTemplateIdx
  | actTypeSetImageBaseUrl
  | actTypeImportPreviewSet
  | actTypeAddPreviewImageUrl
  | actTypeSetPreviewImageUrl
  | actTypeSetPreviewImageSize
  | actTypeSetPreviewImageMedia
  | actTypeMergeParametersToImageUrl
  | actTypeMakeVariantImages
  | actTypeClonePreviewImageUrl
  | actTypeSetCard
  | actTypeSetTagFragment
  | actTypeSetEditTarget
  | actTypeSetDefaultTarget
  | actTypeRemoveFromSet
  | actTypeSortSet;

export const previewContextInitialState: PreviewContextState = {
  validateAssets: false,
  assets: [],
  templateIdx: -1,
  imageBaseUrl: '',
  baseParameterSet: [],
  baseMedias: [],
  editTargetKey: '',
  defaultTargetKey: '',
  card: {
    cardType: 'summary_large_image',
    title: '',
    description: ''
  },
  tagFragment: {
    altText: '',
    linkText: '',
    asThumb: true,
    newTab: false,
    srcsetDescriptor: 'auto',
    disableWidthHeight: false
  },
  previewSetState: '',
  previewSetKind: '',
  previewSet: []
};

function nextPreviewSetState(
  state: PreviewContextState,
  action: actType
): PreviewSetState {
  let ret = state.previewSetState;
  switch (action.type) {
    case 'resetPreviewSet':
      ret = '';
      break;
    case 'importJson':
      ret = 'init';
      break;
    case 'setTemplateIdx':
      ret = state.previewSetState;
      break;
    case 'setImageBaseUrl':
      ret = 'pre-init';
      break;
    case 'importPreviewSet':
      ret = 'init';
      break;
    case 'addPreviewImageUrl':
      ret = 'edited';
      break;
    case 'setPreviewImageUrl':
      ret = 'edited';
      break;
    case 'setPreviewImageSize':
      ret = state.previewSetState;
      break;
    case 'setPreviewImageMedia':
      ret = 'edited';
      break;
    case 'mergeParametersToImageUrl':
      ret = 'edited';
      break;
    case 'makeVariantImages':
      ret = 'edited';
      break;
    case 'clonePreviewImageUrl':
      ret = 'edited';
      break;
    case 'setCard':
      ret = state.previewSetState;
      break;
    case 'setTagFragment':
      ret = state.previewSetState;
      break;
    case 'setEditTarget':
      ret = 'edited';
      break;
    case 'setDefaultTarget':
      ret = 'edited';
      break;
    case 'removeFromSet':
      ret = 'edited';
      break;
    case 'sortSet':
      ret = state.previewSetState;
      break;
  }
  return ret;
}

export function previewContextReducer(
  state: PreviewContextState,
  action: actType
): PreviewContextState {
  const newState: PreviewContextState = { ...state };
  switch (action.type) {
    // case 'setAssets':
    //   try {
    //     newState.assets = JSON.parse(action.payload[0]);
    //   } catch (err) {
    //     console.error(`error: assets parse error: ${err.name}`);
    //   }
    //   break;
    case 'resetPreviewSet':
      newState.editTargetKey = '';
      newState.defaultTargetKey = '';
      newState.previewSetKind = '';
      newState.previewSet = [];
      break;
    case 'importJson':
      try {
        const iState: PreviewContextState = JSON.parse(action.payload[0]);
        const importImageBaseUrl = action.payload[1];
        if (importImageBaseUrl) {
          iState.imageBaseUrl = importImageBaseUrl;
          iState.previewSet.forEach((v) => {
            v.baseImageUrl = importImageBaseUrl;
            const previewUrl = v.previewUrl.split('?', 2);
            v.previewUrl = `${importImageBaseUrl}?${previewUrl[1]}`;
          });
        }
        // TODO: import / export 用の型を作った方が良い
        // newState.validateAssets = iState.validateAssets;
        // newState.assets = iState.assets;
        // newState.templateIdx = iState.templateIdx;
        // 上の 3 フィールドは iState には存在していない(schema で ignore している)
        Object.keys(iState).forEach((k) => {
          (newState as any)[k] = iState[k as keyof PreviewContextState];
        });
        // newState.imageBaseUrl = iState.imageBaseUrl;
        // newState.baseParameterSet = iState.baseParameterSet;
        // newState.baseMedias = iState.baseMedias;
        // newState.editTargetKey = iState.editTargetKey;
        // newState.defaultTargetKey = iState.defaultTargetKey;
        // newState.card = iState.card;
        // newState.tagFragment = iState.tagFragment;
        // newState.previewSetState = iState.previewSetState;
        // newState.previewSetKind = iState.previewSetKind;
        // newState.previewSet = iState.previewSet;
      } catch (_err) {}
      break;
    case 'setTemplateIdx':
      newState.templateIdx = action.payload[0];
      break;
    case 'setImageBaseUrl':
      newState.previewSetKind = action.payload[0];
      newState.imageBaseUrl = action.payload[1];
      break;
    case 'importPreviewSet':
      newState.previewSetKind = action.payload[0];
      newState.imageBaseUrl = action.payload[1];
      newState.baseParameterSet = action.payload[2];
      newState.baseMedias = action.payload[3];
      const medias = action.payload[3] || [];
      const mediasLen = medias.length;
      newState.previewSet = action.payload[2].map((v, i) => {
        const [u, p] = action.payload[1].split('?', 2);
        const q = imgUrlParamsMergeObject(
          p ? imgUrlParamsParseString(p) : [],
          v
        );
        const s = imgUrlParamsToString(q);
        const paramsString = s ? `?${s}` : '';
        const previewItem: PreviewItem = {
          itemKey: `${Date.now()}-${i}`,
          previewUrl: `${u}${paramsString}`,
          baseImageUrl: u,
          imageParams: q,
          imgWidth: 0,
          imgHeight: 0,
          imgDispDensity: imgDispDensity(q),
          media: i < mediasLen ? medias[i] : 'auto'
        };
        return previewItem;
      });
      const l = newState.previewSet.length;
      if (l > 0) {
        newState.editTargetKey = newState.previewSet[0].itemKey;
        newState.defaultTargetKey = newState.previewSet[l - 1].itemKey;
      }
      break;
    case 'addPreviewImageUrl':
      if (action.payload[0]) {
        const [u, p] = action.payload[0].split('?', 2);
        const q = p ? imgUrlParamsParseString(p) : [];
        const previewItem: PreviewItem = {
          itemKey: `${Date.now()}`,
          previewUrl: action.payload[0],
          baseImageUrl: u,
          imageParams: q,
          imgWidth: 0,
          imgHeight: 0,
          imgDispDensity: imgDispDensity(q),
          media: 'auto'
        };
        newState.editTargetKey = previewItem.itemKey;
        if (newState.defaultTargetKey === '') {
          newState.defaultTargetKey = previewItem.itemKey;
        }
        newState.previewSet.push(previewItem);
      }
      break;
    case 'setPreviewImageUrl':
      if (action.payload[0]) {
        const [u, p] = action.payload[0].split('?', 2);
        const q = p ? imgUrlParamsParseString(p) : [];
        const previewItem: PreviewItem = {
          itemKey: state.editTargetKey,
          previewUrl: action.payload[0],
          baseImageUrl: u,
          imageParams: q,
          imgWidth: 0,
          imgHeight: 0,
          imgDispDensity: imgDispDensity(q),
          media: 'auto'
        };
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === state.editTargetKey
        );
        if (idx >= 0) {
          if (previewItem.previewUrl === state.previewSet[idx].previewUrl) {
            previewItem.imgWidth = state.previewSet[idx].imgWidth;
            previewItem.imgHeight = state.previewSet[idx].imgHeight;
            previewItem.media = state.previewSet[idx].media;
          }
          newState.previewSet[idx] = previewItem;
        } else {
          newState.previewSet.push(previewItem);
        }
      }
      break;
    case 'setPreviewImageSize':
      if (action.payload[0]) {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          newState.previewSet[idx].imgWidth = action.payload[1];
          newState.previewSet[idx].imgHeight = action.payload[2];
        }
      }
      break;
    case 'setPreviewImageMedia':
      if (action.payload[0]) {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          newState.previewSet[idx].media = action.payload[1];
        }
      }
      break;
    case 'mergeParametersToImageUrl':
      if (
        action.payload[0] &&
        action.payload[1].length === 1 &&
        action.payload[2].length <= 1
      ) {
        const idx = getTargetItemIndex(state.previewSet, action.payload[0]);
        if (idx >= 0) {
          const item = state.previewSet[idx];
          const q = imgUrlParamsMergeObject(
            item.imageParams,
            action.payload[1][0]
          );
          const s = imgUrlParamsToString(q);
          const paramsString = s ? `?${s}` : '';

          newState.previewSet[
            idx
          ].previewUrl = `${item.baseImageUrl}${paramsString}`;
          newState.previewSet[idx].imageParams = q;
          newState.previewSet[idx].imgWidth = 0;
          newState.previewSet[idx].imgHeight = 0;
          newState.previewSet[idx].imgDispDensity = imgDispDensity(q);
          newState.previewSet[idx].media = action.payload[2][0];
          newState.editTargetKey = state.previewSet[idx].itemKey;
        }
      }
      break;
    case 'makeVariantImages':
      if (action.payload[0]) {
        const idx = getTargetItemIndex(state.previewSet, action.payload[0]);
        if (idx >= 0) {
          const item = state.previewSet[idx];
          const medias = action.payload[2] || [];
          const mediasLen = medias.length;
          newState.previewSet = action.payload[1].map((v, i) => {
            const q = imgUrlParamsMergeObject(item.imageParams, v);
            const s = imgUrlParamsToString(q);
            const paramsString = s ? `?${s}` : '';
            const previewItem: PreviewItem = {
              itemKey: `${Date.now()}-${i}`,
              previewUrl: `${item.baseImageUrl}${paramsString}`,
              baseImageUrl: item.baseImageUrl,
              imageParams: q,
              imgWidth: 0,
              imgHeight: 0,
              imgDispDensity: imgDispDensity(q),
              media: i < mediasLen ? medias[i] : 'auto'
            };
            return previewItem;
          });
          const l = newState.previewSet.length;
          if (l > 0) {
            newState.editTargetKey = newState.previewSet[0].itemKey;
            newState.defaultTargetKey = newState.previewSet[l - 1].itemKey;
          }
        }
      }
      break;
    case 'clonePreviewImageUrl':
      if (action.payload[0]) {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          //array の clone 代わりに再作成
          const [u, p] = state.previewSet[idx].previewUrl.split('?', 2);
          const previewItem: PreviewItem = {
            itemKey: `${Date.now()}`,
            previewUrl: state.previewSet[idx].previewUrl,
            baseImageUrl: u,
            imageParams: p ? imgUrlParamsParseString(p) : [],
            imgWidth: state.previewSet[idx].imgWidth,
            imgHeight: state.previewSet[idx].imgHeight,
            imgDispDensity: state.previewSet[idx].imgDispDensity,
            media: state.previewSet[idx].media
          };
          newState.previewSet.splice(idx + 1, 0, previewItem);
          newState.editTargetKey = previewItem.itemKey;
        }
      }
      break;
    case 'setCard':
      newState.card.cardType = action.payload[0];
      newState.card.title = action.payload[1];
      newState.card.description = action.payload[2];
      break;
    case 'setTagFragment':
      newState.tagFragment.altText = action.payload[0];
      newState.tagFragment.linkText = action.payload[1];
      newState.tagFragment.asThumb = action.payload[2];
      newState.tagFragment.newTab = action.payload[3];
      newState.tagFragment.srcsetDescriptor = action.payload[4];
      newState.tagFragment.disableWidthHeight = action.payload[5];
      break;
    case 'setEditTarget':
      newState.editTargetKey = action.payload[0];
      break;
    case 'setDefaultTarget':
      newState.defaultTargetKey = action.payload[0];
      break;
    case 'removeFromSet':
      {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          state.previewSet.splice(idx, 1);
        }
      }
      break;
    case 'sortSet':
      newState.previewSet.sort((a, b) => {
        const r = imgWidthCss(b) - imgWidthCss(a);
        return r === 0 ? b.imgDispDensity - a.imgDispDensity : r;
      });
      break;
  }
  newState.previewSetState = nextPreviewSetState(state, action);
  return newState;
}

const PreviewContext = React.createContext(previewContextInitialState);

export default PreviewContext;
