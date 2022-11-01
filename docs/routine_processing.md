# 定形処理化

画像ファイルを実際のコンテンツで利用する場合、生成されたタグを直接利用するのではなく [unified](https://github.com/unifiedjs/unified) や [cheerio](https://cheerio.js.org/) などでテンプレート的に利用することが多くなると予想しています。

とくに microCMS では「画像ファイル URL の直接利用は非推奨」となっているため、生成したタグ等はテンプレート的に利用することがベターだと言えます。

## Rendering API の特性を利用

imgix の Rendering API では「画像を GET するときに URL へクエリーパラメーターを付加することで画像の加工が実行」されます。

また、同じような画像(画角等が同じ)であれば、他の画像用に作成したパラメーターでもそのまま切り貼り(URL の末尾へ連結)しても違和感が少なく利用できます。

以下の 2 つの例はこの特性を利用しています。

### テンプレート化の例

「Try it」画面の「Make testbed 〜」では、生成されたタグの `src` 属性を差し替えるコードを CodePen 上へアップロードします。

アップロードされた画面では、 他画像の URL (imgix へアップロードされているもの)を「Enter another image url」へ入力することで、異なる画像での適用状況を確認できます。

動作の概要については以下の動画を参照してください。

[![ImageURL Workbench: imgix の Rendering API でレスポンシブ対応](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/89d1dc2babc143429999bbdf3f63dfbf/youtube-thumb.png?auto=compress&mark64=aHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS9OajZSc0VyaXd6US8wLmpwZw&mark-pad64=MA&txt64=4pa277iP&txt-align64=Y2VudGVyLG1pZGRsZQ&txt-shad64=Mw&txt-size64=NjA)](http://www.youtube.com/watch?v=Nj6RsEriwzQ)

### スクリプト化の例

「Try it」画面の「Make images by using current parameters」では、画像を加工しながらダウンロードするスクリプトを生成しています。

動作の概要については以下の動画を参照してください。

[![imgix の画像を加工するテンプレートスクリプト生成](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/89d1dc2babc143429999bbdf3f63dfbf/youtube-thumb.png?auto=compress&mark64=aHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS9rWExvemUtWGtuZy8wLmpwZw&mark-pad64=MA&txt64=4pa277iP&txt-align64=Y2VudGVyLG1pZGRsZQ&txt-shad64=Mw&txt-size64=NjA)](http://www.youtube.com/watch?v=kXLoze-Xkng)


## [実験的実装] 中間表現

※ 現状では仕様が固まっていません。

画像の画角などにあわせてテンプレート化しやすいように、生成した内容を中間表現として出力できます。


