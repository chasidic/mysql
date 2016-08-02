import { processString } from 'typescript-formatter';
import { IColumn } from './InformationSchema';
import { writeFileAsync, removeAsync, ensureDirAsync } from 'fs-extra-promise';
import { resolve, dirname, join } from 'path';

const INTERFACES = 'INTERFACES';
const FIELDS = 'FIELDS';
const INDEX = 'index.ts';
const INDEXD = 'index.d.ts';
const ABSTRACT = 'GeneratedTable';

interface IColumnMap {
  name: string;
  type: string;
}

interface ISchemaMap {
  [table: string]: IColumnMap[];
}

interface ISchemasMap {
  [schema: string]: ISchemaMap;
}

function mapSchemas (columns: IColumn[]) {
  let schemas: ISchemasMap = {};

  for (let column of columns) {
    schemas[column.TABLE_SCHEMA] = schemas[column.TABLE_SCHEMA] || {};
    schemas[column.TABLE_SCHEMA][column.TABLE_NAME] = schemas[column.TABLE_SCHEMA][column.TABLE_NAME] || [];

    let optional = column.IS_NULLABLE === 'YES' ? '?' : '';
    let name = column.COLUMN_NAME;

    if (column.EXTRA) {
      // console.log(column.COLUMN_NAME, column.EXTRA);
    }

    let kv = 'any';

    switch (column.DATA_TYPE) {
      case 'bigint':
      case 'int':
      case 'decimal':
      case 'double':
      case 'tinyint':
      case 'smallint':
      case 'float':
      case 'mediumint':
        kv = 'number';
        break;
      case 'longtext':
      case 'varchar':
      case 'mediumtext':
      case 'char':
      case 'text':
        kv = 'string';
        break;
      case 'datetime':
      case 'timestamp':
      case 'time':
      case 'date':
        kv = 'Date';
        break;
      case 'blob':
      case 'longblob':
        kv = 'Blob';
        break;
      case 'set':
        let enums = column.COLUMN_TYPE
          .replace(/(set|[\(\)])/g, '')
          .replace(/,/g, ' | ')
          .replace(/'/g, '"');
        kv = `Set<${ enums }>`;
        break;
      case 'enum':
        kv = column.COLUMN_TYPE
          .replace(/(enum|[\(\)])/g, '')
          .replace(/,/g, ' | ')
          .replace(/'/g, '"');
        break;
      case 'bit':
        kv = 'boolean';
        break;
      default:
        console.log(column);
    }

    let type = `${ column.COLUMN_NAME }${ optional }: ${ kv };`;
    schemas[column.TABLE_SCHEMA][column.TABLE_NAME].push({ name, type });
  }

  return schemas;
}

async function writeTypescriptFile (filename: string, output: string) {
  let result = await processString('', output.trim(), {
    replace: false,
    verify: false,
    tsconfig: false,
    tslint: false,
    editorconfig: false,
    tsfmt: true
  });

  await ensureDirAsync(dirname(filename));
  await writeFileAsync(filename, result.dest, { encoding: 'utf-8' });
}

export async function generateTypescript (columns: IColumn[], dir: string) {
  const DIR = resolve(dir);
  await removeAsync(DIR);
  await ensureDirAsync(DIR);

  let schemas = mapSchemas(columns);

  for (let schema in schemas) {
    const schemaDir = resolve(DIR, schema);
    const interfacesDir = resolve(DIR, schema, INTERFACES);
    const fieldsDir = resolve(DIR, schema, FIELDS);

    let outputTables = `
      import { ${ ABSTRACT } } from '../${ ABSTRACT }';
      import * as ${ INTERFACES } from './${ INTERFACES }';
      import * as ${ FIELDS } from './${ FIELDS }';
    `;

    let outputInterfaces = '';
    let outputFields = '';

    for (let table in schemas[schema]) {

      const interfaceName = `I${ table }`;
      const interfaceContent = schemas[schema][table].map(col => col.type).join('\n');
      const fieldsArray = schemas[schema][table].map(col => `"${ col.name }"`).join(', ');

      outputInterfaces += `
        export interface ${ interfaceName } {
          ${ interfaceContent }
        }
      `;

      outputFields += `
        export const ${ table } = [ ${ fieldsArray } ];
      `;

      outputTables += `
        export let ${ table } = new ${ ABSTRACT } <${ INTERFACES }.${ interfaceName }>(${ FIELDS }.${ table });
      `;

    }

    await ensureDirAsync(interfacesDir);
    await ensureDirAsync(fieldsDir);
    await writeTypescriptFile(join(interfacesDir, INDEXD), outputInterfaces);
    await writeTypescriptFile(join(fieldsDir, INDEX), outputFields);
    await writeTypescriptFile(join(schemaDir, INDEX), outputTables);
  }

  await writeTypescriptFile(join(DIR, `${ ABSTRACT }.ts`), `
    export class ${ ABSTRACT }<T> {
      constructor(public fields: string[]) { }
      get(fields: string[]) {}
      create(object: T) {}
      update(object: T) {}
      delete(object: T) {}
    }
  `);

  await writeTypescriptFile(join(DIR, INDEX), `
    ${ Object.keys(schemas).map(schema => `
      import * as ${ schema } from './${ schema }';
      export { ${ schema } };
    ` ).join('') }
  `);
};
