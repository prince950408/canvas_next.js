// タグを直接使うのではなくテンプレート等で使う用に中間表現として扱うためのユーティリティ等.
// unified の hast の利用(あるいは Cheerio のオブジェクトのtoJSON 的なもの)も考えたのだが、
// srcset 等は別途組み立てなおす必要があるので独自に作成することにした.
export const BreakPointValues = [240, 330, 360, 410, 530, 760, 1020] as const;
export const BreakPointAutoAndValues = [
  'auto',
  'fit',
  ...BreakPointValues
] as const;
export type BreakPoint = typeof BreakPointAutoAndValues[number];

export function breakPointValue(
  media: BreakPoint,
  imgWidth: number
): BreakPoint {
  if (media === 'auto' || media === 'fit') {
    const idx = BreakPointValues.findIndex(
      (v) => typeof v === 'number' && v >= imgWidth
    );
    if (idx >= 0) {
      if (media === 'auto') {
        if (idx === 0) {
          return BreakPointValues[0];
        } else {
          return BreakPointValues[idx - 1];
        }
      }
      return BreakPointValues[idx];
    }
    return BreakPointValues[BreakPointValues.length - 1];
  }
  return media;
}

export const SrcSetDescriptorValues = ['auto', 'w', 'x'] as const;
export type SrcSetDescriptor = typeof SrcSetDescriptorValues[number];

export type SrcAttr = {
  kind: 'src';
  url: {
    base: string;
    params: { key64: string; value64: string }[]; // base64 variant の値がセットされる
    paramsStr: string; // toString された文字列
  };
};

export type SrcSetAttr = {
  kind: 'srcSet';
  descriptor: SrcSetDescriptor;
  set: {
    src: SrcAttr;
    width: number; // 各 src のサイズ
    height: number;
    density: string;
  }[];
};

export type SourceNode = {
  kind: 'suorce';
  src?: SrcAttr;
  srcset: SrcSetAttr;
  width?: number; // srcset 全体のcssサイズ(必ずしも全体サイズが一致しているとはかぎらない )
  height?: number;
  breakPoint: BreakPoint;
  suggestMedia?: string; // auto の場合、画像の幅より狭いサイズでの media  が設定される.
  sizes?: string[];
};

export type ImgNode = {
  kind: 'img';
  alt: string;
  src: SrcAttr;
  srcset?: SrcSetAttr;
  width?: number;
  height?: number;
  // media?: string;
  sizes?: string[];
};

export type PictureNode = {
  kind: 'picture';
  sources: SourceNode[];
  img: ImgNode;
};
