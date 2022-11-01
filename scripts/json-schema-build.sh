#!/bin/sh

# --defaultProps : ajv  ではエラー(設定によっては回避できるかもだが、試していない)
#                  Error: strict mode: unknown keyword: "defaultProperties"
# --noExtraProps : 定義されてないフィールドが使われたらエラーにするため。
# --required     : 定義されているフィールドが使われていなかったらエラーにするため
npx typescript-json-schema --noExtraProps --required \
    --include components/PreviewContext.tsx \
    --include utils/imgParamsUtils.ts \
    --include utils/intermediate.ts \
    --include src/template.ts \
         -- ./tsconfig.json PreviewContextState > src/jsonSchemaPreviewContext.json
