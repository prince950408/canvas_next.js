// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboardExec(text: string): Error {
  let ret = undefined;

  const textArea = document.createElement('textarea');

  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    ret = err;
  }

  document.body.removeChild(textArea);

  return ret;
}

export default async function copyTextToClipboard(
  text: string
): Promise<Error | undefined> {
  let ret = undefined;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => {},
      () => {
        ret = copyTextToClipboardExec(text);
      }
    );
  } else {
    ret = copyTextToClipboardExec(text);
  }
  return ret;
}
