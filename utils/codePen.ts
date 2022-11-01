// https://blog.codepen.io/documentation/prefill/

export type CodePenDefinePostData = {
  // All Optional
  title?: string; // "New Pen!",
  description?: string; // "It's about stuff.",
  private?: boolean; // false, // true || false - When the Pen is saved, it will save as Private if logged in user has that privledge, otherwise it will save as public
  parent?: string; // id // If supplied, the Pen will save as a fork of this id. Note it's not the slug, but ID. You can find the ID of a Pen with `window.CP.pen.id` in the browser console.
  tags?: string[]; // ["tag1", "tag2"], // an array of strings
  editors?: string; // "101", // Set which editors are open. In this example HTML open, CSS closed, JS open
  layout?: 'top' | 'left' | 'right'; // "left", // top | left | right
  html?: string; // "<div>HTML here.</div>",
  html_pre_processor?: 'none' | 'slim' | 'haml' | 'markdown'; // "none" || "slim" || "haml" || "markdown",
  css?: string; // "html { color: red; }",
  css_pre_processor?: 'none' | 'less' | 'scss' | 'sass' | 'stylus'; // "none" || "less" || "scss" || "sass" || "stylus",
  css_starter?: 'normalize' | 'reset' | 'neither'; // "normalize" || "reset" || "neither",
  css_prefix?: 'autoprefixer' | 'prefixfree' | 'neither'; // "autoprefixer" || "prefixfree" || "neither",
  js?: string; // "alert('test');",
  js_pre_processor?:
    | 'none'
    | 'coffeescript'
    | 'babel'
    | 'livescript'
    | 'typescript'; // "none" || "coffeescript" || "babel" || "livescript" || "typescript",
  html_classes?: string; // "loading",
  head?: string; // "<meta name='viewport' content='width=device-width'>",
  css_external?: string; // "http://yoursite.com/style.css", // semi-colon separate multiple files
  js_external?: string; // "http://yoursite.com/script.js" // semi-colon separate multiple files
};
