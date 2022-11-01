export type SampleImageParameters = { [key: string]: string };
export type SampleImageParametersSet = {
  query: string;
  fileNameSuffix: string;
  parameters: SampleImageParameters;
}[];

export const SampleImageBuildParametersSet: SampleImageParametersSet = [
  {
    query: '',
    fileNameSuffix: '',
    parameters: {
      auto: 'compress',
      crop: 'entropy',
      fit: 'crop',
      h: '80',
      w: '160'
    }
  }
];
export type SampleImageCredit = {
  author: string[];
  license?: { fullName?: string; id: string; url: string };
  webPage?: string;
};

export type SampleImage = {
  title: string;
  imageUrl: string;
  imagePaths: string[]; // 静的サイトとしてビルドした場合は表示用の画像をローカルに置く予定(たぶん)
  credit?: SampleImageCredit;
};

export type SampleImageList = SampleImage[];

export const BuiltinSampleImages: SampleImageList = [
  {
    title: 'sample01',
    imageUrl:
      'https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/34b6978634ad4938af4d475e6573d332/sample01.jpg',
    imagePaths: [],
    credit: {
      author: ['hankei6km'],
      license: {
        id: 'CC0-1.0',
        url: 'https://spdx.org/licenses/CC0-1.0.html'
      },
      webPage: 'https://github.com/hankei6km'
    }
  },
  {
    title: 'sample02',
    imageUrl:
      'https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/8add25df5ec24fdb9bd9ca6773201252/sample02.jpg',
    imagePaths: [],
    credit: {
      author: ['hankei6km'],
      license: {
        id: 'CC0-1.0',
        url: 'https://spdx.org/licenses/CC0-1.0.html'
      },
      webPage: 'https://github.com/hankei6km'
    }
  },
  {
    title: 'sample03',
    imageUrl:
      'https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/437d0e523bf74ac8a7c5a87385d76330/sample03.jpg',
    imagePaths: [],
    credit: {
      author: ['hankei6km'],
      license: {
        id: 'CC0-1.0',
        url: 'https://spdx.org/licenses/CC0-1.0.html'
      },
      webPage: 'https://github.com/hankei6km'
    }
  },
  {
    title: 'sample04',
    imageUrl:
      'https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/2ca9d04e541745ad97b0fcdce2a92764/sample04.jpg',
    imagePaths: [],
    credit: {
      author: ['hankei6km'],
      license: {
        id: 'CC0-1.0',
        url: 'https://spdx.org/licenses/CC0-1.0.html'
      },
      webPage: 'https://github.com/hankei6km'
    }
  },
  {
    title: 'sample05',
    imageUrl:
      'https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/6d96e87dd9474049b104a04ce7df0731/sample05.jpg',
    imagePaths: [],
    credit: {
      author: ['hankei6km'],
      license: {
        id: 'CC0-1.0',
        url: 'https://spdx.org/licenses/CC0-1.0.html'
      },
      webPage: 'https://github.com/hankei6km'
    }
  },
];
