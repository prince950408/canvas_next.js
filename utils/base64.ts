const regExpPlus = /\+/g;
const regExpSlash = /\//g;
const regExpTrailEq = /=+$/g;

const regExpHyphen = /-/g;
const regExpLowDash = /_/g;

export function encodeBase64Url(v: string): string {
  // https://docs.imgix.com/apis/rendering#base64-variants
  // https://developer.mozilla.org/ja/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
  // https://stackoverflow.com/questions/24523532/how-do-i-convert-an-image-to-a-base64-encoded-data-url-in-sails-js-or-generally
  // https://qiita.com/awakia/items/049791daca69120d7035
  return Buffer.from(`${v}`, 'utf-8')
    .toString('base64')
    .replace(regExpSlash, '_')
    .replace(regExpPlus, '-')
    .replace(regExpTrailEq, '');
}

export function decodeBase64Url(v: string): string {
  // 末尾の = は足さなくてもエラー等にはならないもよう
  return Buffer.from(
    v.replace(regExpHyphen, '+').replace(regExpLowDash, '/'),
    'base64'
  ).toString();
}
