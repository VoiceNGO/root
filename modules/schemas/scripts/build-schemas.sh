cd "$(dirname "$0")"
cd ../src/json-schemas

# Add any additional json files to the following line
for f in eslintrc.json package.json prettierrc.json tsconfig.json;
  do curl -O https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/${f};
done;

cd ../..
yarn json2ts -i 'src/json-schemas/**/*.json' -o src/json-types