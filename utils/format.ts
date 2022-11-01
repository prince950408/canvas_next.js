export function imageTitleInfo({
  imgWidth,
  imgHeight,
  imgDispDensity,
  imgFileSize
}: {
  imgWidth: number;
  imgHeight: number;
  imgDispDensity: number;
  imgFileSize: number;
}): string {
  return `${imgWidth}x${imgHeight} ${
    imgDispDensity > 0 && imgDispDensity !== 1 ? `${imgDispDensity}x` : ''
  } ${Math.round(imgFileSize / 1000)}kB`;
}
