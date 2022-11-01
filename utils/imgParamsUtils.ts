import imgixUrlParams from 'imgix-url-params/dist/parameters.json';
import { decodeBase64Url, encodeBase64Url } from '../utils/base64';

export type ParamsExpect = {
  [key: string]: any;
};
type Parameters = {
  [key: string]: {
    category: string;
    expects: ParamsExpect[];
    url: string;
    short_description: string;
  } & any;
};
type FontValues = string[];
type CategoryValues = string[];

const urlParams: {
  // とりあえず
  parameters: Parameters;
  categoryValues: CategoryValues;
  fontValues: FontValues;
} = imgixUrlParams;

export function paramsKeyToSpread(
  paramsKey: string,
  paramsExpect: ParamsExpect,
  detail: boolean = true
): { label: string; defaultValue: string | number } {
  const p: any = urlParams.parameters[paramsKey];
  if (p) {
    // console.log(
    //   `key: ${paramsKey}, default: ${
    //     paramsExpect.default !== undefined ? paramsExpect.default : p.default
    //   }`
    // );
    return {
      label: detail
        ? `${p.display_name}(${paramsExpect.type})`
        : p.display_name,
      defaultValue:
        paramsExpect.default !== undefined ? paramsExpect.default : p.default
    };
  }
  return {
    label: '',
    defaultValue: ''
  };
}

export function paramsKeyDisallowBase64(paramsKey: string): boolean {
  const p: any = urlParams.parameters[paramsKey];
  if (p) {
    return p.disallow_base64 === undefined ? false : p.disallow_base64;
  }
  return false;
}

export function pruneExpects(exp: ParamsExpect[]): ParamsExpect[] {
  const m = exp.map((v) => {
    const r = { ...v };
    if (r.type === 'url' || r.type === 'path') {
      r.type = 'url or path';
    } else if (r.type === 'hex_color' || r.type === 'color_keyword') {
      r.type = 'color';
    }
    return r;
  });
  const u: { [key: string]: ParamsExpect } = {};
  return m.filter((v) => {
    if (u[v.type]) {
      return false;
    }
    u[v.type] = v;
    return true;
  });
}

export function paramsKeyParameters(
  paramsKey: string
): typeof urlParams['parameters'] | undefined {
  return urlParams.parameters[paramsKey];
}

export function expectToRange(
  exp: ParamsExpect
): [number, number | undefined] | undefined {
  if (exp.suggested_range) {
    const max =
      exp.suggested_range.max !== undefined ? exp.suggested_range.max : 500;
    return [exp.suggested_range.min, max];
  }
  return;
}

export function expectIsColor(exp: ParamsExpect): boolean {
  return exp.type === 'color';
}

export function expectToList(exp: ParamsExpect): string[] | undefined {
  if (exp.possible_values) {
    return exp.possible_values;
  } else if (exp.type === 'font') {
    return urlParams.fontValues;
  }
  return;
}

export type ImgParamsValue = {
  key: string;
  value: string;
};
export type ImgParamsValues = ImgParamsValue[];

type paramTransformerFunc = (v: string | number) => string;
const transformer64Name: paramTransformerFunc = (v: string | number) =>
  `${v}64`;
const transformer64Value: paramTransformerFunc = (v: string | number) =>
  encodeBase64Url(v as string);

const transformerPassthru: paramTransformerFunc = (
  v: string | number
): string => `${v}`;

export function imgUrlParamsToString(
  p: ImgParamsValues,
  plain: boolean = false
): string {
  const q = new URLSearchParams('');
  p.sort(({ key: a }, { key: b }) => a.localeCompare(b)).forEach(
    ({ key, value }) => {
      const disallowBase64 = plain ? true : paramsKeyDisallowBase64(key);
      const transformerName: paramTransformerFunc = disallowBase64
        ? transformerPassthru
        : transformer64Name; // https://github.com/imgix/imgix-url-params disallow_base64
      const transformerValue: paramTransformerFunc = disallowBase64
        ? transformerPassthru
        : transformer64Value;
      q.append(transformerName(key), transformerValue(value));
    }
  );
  return q.toString();
}

export function imgUrlParamsParseString(p: string): ImgParamsValues {
  const ret: ImgParamsValue[] = [];

  const q = new URLSearchParams(p);
  q.forEach((v, k) => {
    if (k.slice(-2) === '64') {
      const bareKeyName = k.slice(0, -2);
      if (paramsKeyParameters(bareKeyName)) {
        ret.push({
          key: k.slice(0, -2),
          value: decodeBase64Url(v)
        });
      }
    } else {
      if (paramsKeyParameters(k)) {
        ret.push({
          key: k,
          value: v
        });
      }
    }
  });

  return ret;
}

export function imgUrlParamsMergeObject(
  p: ImgParamsValues,
  o: { [key: string]: string }
): ImgParamsValues {
  const ret = [...p];
  Object.keys(o).forEach((k) => {
    const idx = p.findIndex(({ key }) => k === key);
    if (idx >= 0) {
      ret[idx].value = o[k];
    } else {
      ret.push({ key: k, value: o[k] });
    }
  });
  return ret;
}

export type ImgParamsItem = {
  category: string;
  paramsKey: string;
  displayName: string;
};
export type ImgParamsItems = ImgParamsItem[];

export function flattenParams(): ImgParamsItems {
  const params = Object.entries(urlParams.parameters);
  return params.map(([k, v]) => ({
    category: v.category,
    displayName: v.display_name,
    paramsKey: k
  }));
}

export function imgParasmItemInclude(p: ImgParamsItem, text: string): boolean {
  return (
    p.paramsKey.includes(text) ||
    p.displayName.includes(text) ||
    p.category.includes(text)
  );
}

export function imgParamsInCategory(
  paramsItems: ImgParamsItems,
  category: string
): ImgParamsItems {
  return paramsItems.filter((v) => v.category === category);
}

export function imgParamsCategories() {
  return urlParams.categoryValues;
}

export function imgDispDensity(p: ImgParamsValues): number {
  const idx = p.findIndex(({ key }) => key === 'dpr');
  if (idx >= 0) {
    return Number.parseFloat(p[idx].value);
  }
  return 1;
}

export function imgDispDensityFromParamsString(s: string): number {
  return imgDispDensity(imgUrlParamsParseString(s));
}
