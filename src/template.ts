import { BreakPoint } from '../utils/intermediate';

// 'basic': auto 等の外観には影響はないが、ファイルサイズ等に影響のあるような項目の指定。インポート時に使う
// 'size': 画像のサイズ変更を行う。workbench 上の各項目に上書きで適用
// 'effective': セピア調等の効果を複数の項目に適用する。workbench 上の各項目に上書きで適用
// 'responsive': １つの項目から画像のサイズ(ピクセル数)が異なる項目を作成する。複数の項目に適用はしない
// 'card': ソーシャルカード(Twitter Card)用にサイズの調整等を行う。'effective' でも良いか?
export type ImportTemplateKind =
  | 'basic'
  | 'size'
  | 'effective'
  | 'responsive'
  | 'card';
export type ImportTemplateParameters = { [key: string]: string };
export type ImportTemplateParametersSet = ImportTemplateParameters[];
export type ImportTemplate = {
  kind: ImportTemplateKind[];
  label: string;
  shortDescription?: string;
  parameters: ImportTemplateParametersSet;
  medias: BreakPoint[];
};

export type ImportTemplateList = ImportTemplate[];

export const BuiltinImportTemplate: ImportTemplateList = [
  {
    kind: ['basic'],
    label: 'plain',
    shortDescription: '',
    parameters: [{}],
    medias: []
  },
  {
    kind: ['basic', 'effective'],
    label: 'compress',
    shortDescription: 'auto=compress',
    parameters: [
      {
        auto: 'compress'
      }
    ],
    medias: []
  },
  {
    kind: ['basic', 'effective'],
    label: 'compress + enhance',
    shortDescription: 'auto=compress,enhance',
    parameters: [
      {
        auto: 'compress,enhance'
      }
    ],
    medias: []
  },
  {
    kind: ['basic', 'effective'],
    label: 'jpeg',
    shortDescription: '画像フォーマット jpeg',
    parameters: [
      {
        fm: 'jpg'
      }
    ],
    medias: []
  },
  {
    kind: ['basic', 'effective'],
    label: 'png',
    shortDescription: '画像フォーマット png',
    parameters: [
      {
        fm: 'png'
      }
    ],
    medias: []
  },
  {
    kind: ['basic', 'effective'],
    label: 'webp',
    shortDescription: '画像フォーマット webp',
    parameters: [
      {
        fm: 'webp'
      }
    ],
    medias: []
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更',
    parameters: [
      {
        crop: 'entropy',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(left)',
    parameters: [
      {
        crop: 'left',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(right)',
    parameters: [
      {
        crop: 'right',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(entropy)',
    parameters: [
      {
        crop: 'entropy',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'blur',
    parameters: [
      {
        blur: '70'
      }
    ],
    medias: []
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'duotone',
    parameters: [
      {
        duotone: '000080,FA8072',
        'duotone-alpha': '100'
      }
    ],
    medias: []
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'monochrome(light)',
    parameters: [
      {
        monochrome: 'ff9b9b9b'
      }
    ],
    medias: []
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'monochrome(dark)',
    parameters: [
      {
        monochrome: 'ff4a4a4a'
      }
    ],
    medias: []
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'sepia tone',
    parameters: [
      {
        sepia: '80'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別(500x300)',
    parameters: [
      {
        dpr: '3',
        h: '300',
        w: '500'
      },
      {
        dpr: '2',
        h: '300',
        w: '500'
      },
      {
        dpr: '1.5',
        h: '300',
        w: '500'
      },
      {
        dpr: '1',
        h: '300',
        w: '500'
      },
      {
        h: '300',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別(500x300) デバッグラベル',
    parameters: [
      {
        dpr: '3',
        h: '300',
        txt: '3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '2',
        h: '300',
        txt: '2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '1.5',
        h: '300',
        txt: '1.5x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '1',
        h: '300',
        txt: '1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        h: '300',
        txt: 'default',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別(dpr 指定のみ)',
    parameters: [
      {
        dpr: '3'
      },
      {
        dpr: '2'
      },
      {
        dpr: '1.5'
      },
      {
        dpr: '1'
      },
      {
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別(dpr 指定のみ) デバッグラベル',
    parameters: [
      {
        dpr: '3',
        txt: '3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        dpr: '2',
        txt: '2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        dpr: '1.5',
        txt: '1.5x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        dpr: '1',
        txt: '1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        txt: 'default',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: 'アートディレクション用(最大800)',
    parameters: [
      {
        dpr: '1',
        w: '800'
      },
      {
        dpr: '1',
        w: '550'
      },
      {
        dpr: '1',
        w: '420'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        w: '380'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        w: '330'
      },
      {
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: 'アートディレクション用(最大800) デバッグラベル',
    parameters: [
      {
        dpr: '1',
        txt: '800 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '70',
        'txt-size': '100',
        w: '800'
      },
      {
        dpr: '1',
        txt: '550 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '550'
      },
      {
        dpr: '1',
        txt: '420 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '420'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        txt: '380 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '380'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        txt: '330 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '330'
      },
      {
        txt: 'default',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '60',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: 'アートディレクション用(最大800 複数dpr)',
    parameters: [
      {
        dpr: '3',
        w: '800'
      },
      {
        dpr: '2',
        w: '800'
      },
      {
        dpr: '1',
        w: '800'
      },
      {
        dpr: '3',
        w: '550'
      },
      {
        dpr: '2',
        w: '550'
      },
      {
        dpr: '1',
        w: '550'
      },
      {
        dpr: '3',
        w: '420'
      },
      {
        dpr: '2',
        w: '420'
      },
      {
        dpr: '1',
        w: '420'
      },
      {
        dpr: '3',
        fit: 'crop',
        h: '400',
        w: '380'
      },
      {
        dpr: '2',
        fit: 'crop',
        h: '400',
        w: '380'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        w: '380'
      },
      {
        dpr: '3',
        fit: 'crop',
        h: '400',
        w: '330'
      },
      {
        dpr: '2',
        fit: 'crop',
        h: '400',
        w: '330'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        w: '330'
      },
      {
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: 'アートディレクション用(最大800 複数dpr) デバッグラベル',
    parameters: [
      {
        dpr: '3',
        txt: '800 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '70',
        'txt-size': '100',
        w: '800'
      },
      {
        dpr: '2',
        txt: '800 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '70',
        'txt-size': '100',
        w: '800'
      },
      {
        dpr: '1',
        txt: '800 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '70',
        'txt-size': '100',
        w: '800'
      },
      {
        dpr: '3',
        txt: '550 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '550'
      },
      {
        dpr: '2',
        txt: '550 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '550'
      },
      {
        dpr: '1',
        txt: '550 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '550'
      },
      {
        dpr: '3',
        txt: '420 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '420'
      },
      {
        dpr: '2',
        txt: '420 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '420'
      },
      {
        dpr: '1',
        txt: '420 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '420'
      },
      {
        dpr: '3',
        fit: 'crop',
        h: '400',
        txt: '380 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '380'
      },
      {
        dpr: '2',
        fit: 'crop',
        h: '400',
        txt: '380 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '380'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        txt: '380 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '380'
      },
      {
        dpr: '3',
        fit: 'crop',
        h: '400',
        txt: '330 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '330'
      },
      {
        dpr: '2',
        fit: 'crop',
        h: '400',
        txt: '330 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '330'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        txt: '330 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '330'
      },
      {
        txt: 'default',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '60',
        w: '500'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別(ビューポート760以上で複数dpr)',
    parameters: [
      {
        dpr: '3',
        w: '800'
      },
      {
        dpr: '2',
        w: '800'
      },
      {
        dpr: '1',
        w: '800'
      },
      {
        w: '800'
      }
    ],
    medias: []
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別(ビューポート760以上で複数dpr) デバッグラベル',
    parameters: [
      {
        dpr: '3',
        txt: '800 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '800'
      },
      {
        dpr: '2',
        txt: '800 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '800'
      },
      {
        dpr: '1',
        txt: '800 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '800'
      },
      {
        txt: 'default(800)',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '800'
      }
    ],
    medias: []
  },
  {
    kind: ['card'],
    label: 'teitter card',
    shortDescription: 'Teitter Card用に画像サイズ等を調整',
    parameters: [
      {
        h: '719',
        fit: 'crop',
        w: '1280'
      }
    ],
    medias: []
  },
  {
    kind: ['card'],
    label: 'teitter card',
    shortDescription: 'Teitter Card用に画像サイズ等を調整(entropy)',
    parameters: [
      {
        h: '719',
        crop: 'entropy',
        fit: 'crop',
        w: '1280'
      }
    ],
    medias: []
  },
  {
    kind: ['card'],
    label: 'teitter card',
    shortDescription: 'Teitter Card用に画像サイズ等を調整(face)',
    parameters: [
      {
        h: '719',
        crop: 'faces',
        fit: 'crop',
        w: '1280'
      }
    ],
    medias: []
  }
];

export function getImportTemplateItem(templateIdx: number): ImportTemplate {
  return BuiltinImportTemplate[templateIdx];
}