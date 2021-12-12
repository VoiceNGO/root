#### For JSON schemas

1. Find the schema you want at https://github.com/SchemaStore/schemastore/tree/master/src/schemas/json
1. Add it to `/scripts/build-schemas.sh`
1. Run `/scripts/build-schemas.sh`
1. Add the type to `/voice/modules/node-utils/src/fs/read-json-file.ts`
