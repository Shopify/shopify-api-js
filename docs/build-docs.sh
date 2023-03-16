COMPILE_DOCS="yarn tsc --project docs/tsconfig.docs.json --types react --moduleResolution node  --target esNext  --module CommonJS && generate-docs --overridePath ./docs/typeOverride.json --input ./lib ./adapters ./runtime --output ./docs/generated && rm -rf ./lib/**/*.doc.js ./lib/*.doc.js && rm -rf ./adapters/**/*.doc.js ./adapters/*.doc.js && rm -rf ./runtime/**/*.doc.js ./runtime/*.doc.js"
COMPILE_STATIC_PAGES="yarn tsc docs/staticPages/*.doc.ts --types react --moduleResolution node  --target esNext  --module CommonJS && generate-docs --isLandingPage --input ./docs/staticPages --output ./docs/generated && rm -rf docs/staticPages/*.doc.js"

if [ "$1" = "isTest" ];
then
COMPILE_DOCS="yarn tsc --project docs/tsconfig.docs.json --types react --moduleResolution node  --target esNext  --module CommonJS && generate-docs --overridePath ./docs/typeOverride.json --input ./lib ./adapters ./runtime --output ./docs/temp && rm -rf ./lib/**/*.doc.js ./lib/*.doc.js && rm -rf ./adapters/**/*.doc.js ./adapters/*.doc.js && rm -rf ./runtime/**/*.doc.js ./runtime/*.doc.js"
COMPILE_STATIC_PAGES="yarn tsc docs/staticPages/*.doc.ts --types react --moduleResolution node  --target esNext  --module CommonJS && generate-docs --isLandingPage --input ./docs/staticPages --output ./docs/temp && rm -rf docs/staticPages/*.doc.js"
fi

eval $COMPILE_DOCS && eval $COMPILE_STATIC_PAGES
