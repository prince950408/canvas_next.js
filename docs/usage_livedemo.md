# 基本的な使い方

[ImageURL Wrokbench](https://image-url-workbench.vercel.app/) にはライブラリーから画像を選択する機能がないため、クリップボード経由で画像の URL をコピーし貼り付けることで各種処理を行います。

以下の記述では microCMS のライブラリーを例にしていますが、他ライブラリーからでも URL がコピーできれば基本的な操作に違いはありません。


### 画像の加工

単一の画像として利用する場合の操作方法です。

1. microCMS のライブラリーから画像ファイルの URL をコピー
<br>[![画像ファイルの URL をコピーしているスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png?auto=compress)
1. [ImageURL Wrokbench](https://image-url-workbench.vercel.app/) を開き URL を貼り付けて「NEW」をクリック
<br>[![URL を張り付けているスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png?auto=compress)
1. 簡易的な加工は画面上部の「Size」ボタンなどで指定
<br>[![ボタンの位置を示すスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c49133abeb774408aa502cd594e8891f/docs-apply-template.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c49133abeb774408aa502cd594e8891f/docs-apply-template.png?auto=compress)
1. 詳細な調整は画像をクリックし「Render」画面で指定
<br>[![Render 画面のスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d762071c6dd5494391c96aca397cf271/docs-render.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d762071c6dd5494391c96aca397cf271/docs-render.png?auto=compress)
1. 加工が完了したら「Workbench」画面で「Try it」ボタンをクリックし、用途に合わせてドロワーを開く
<br>[![Trt it 画面のスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/f1d8e1e7e56241588fd8d6773c6c531a/docs-try-it.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/f1d8e1e7e56241588fd8d6773c6c531a/docs-try-it.png?auto=compress)

### レスポンシブ用の画像ファイルセット作成

レスポンシブ用タグを作成する基本的な操作です。上記の加工後にレスポンシブ用テンプレートの適用もできます(例: 画像をセピア調にしたあと、レスポンシブ対応にするなど)。

1. microCMS のライブラリーから画像ファイルの URL をコピー
<br>[![画像ファイルの URL をコピーしているスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png?auto=compress)
1. [ImageURL Wrokbench](https://image-url-workbench.vercel.app/) を開き URL を貼り付けて「NEW」をクリック
<br>[![URL を張り付けているスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png?auto=compress)
1. 画面上部のボタンから「Responsive」ボタンをクリックし表示されたテンプレートを選択
<br>[![レスポンシブ用テンプレート一覧のスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/e23bda3b44d1485e915cdfc0adbf93e4/docs-responsive.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/e23bda3b44d1485e915cdfc0adbf93e4/docs-responsive.png?auto=compress)
1. 画像ファイルセットが生成されるので、必要に応じて画像を選択する
<br>[![画像ファイルセットのスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/10ba31f5fdc74bcba454824d8fccf055/docs-image-set.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/10ba31f5fdc74bcba454824d8fccf055/docs-image-set.png?auto=compress)
1. 「Try it」画面から「Preview &lt;Picture&gt; Tag」等を開き「Try it on CodePen」横のボタンをクリック
<br>[![Try it on CodePen ボタンのスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/588ad0fa17df4075a43a19edf7d38464/docs-try-it-on-codepen.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/588ad0fa17df4075a43a19edf7d38464/docs-try-it-on-codepen.png?auto=compress)
1. CodePen 上で動作を確認
<br>[![CodePen の幅を 800 にしたときのスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d99a0b14179d473480472ddfb71d1e4d/docs-codepen-800.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d99a0b14179d473480472ddfb71d1e4d/docs-codepen-800.png?auto=compress)
<br>[![CodePen の幅を 330 にしたときのスクリーンショット](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/425525dfa718476ea7f3ff6964e2bb3d/docs-codepen-330.png?auto=compress&w64=NTAw)](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/425525dfa718476ea7f3ff6964e2bb3d/docs-codepen-330.png?auto=compress)

