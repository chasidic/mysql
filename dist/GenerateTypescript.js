"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const typescript_formatter_1 = require('typescript-formatter');
const fs_extra_promise_1 = require('fs-extra-promise');
const path_1 = require('path');
const INTERFACES = 'INTERFACES';
const FIELDS = 'FIELDS';
const INDEX = 'index.ts';
const INDEXD = 'index.d.ts';
const ABSTRACT = 'GeneratedTable';
function mapSchemas(columns) {
    let schemas = {};
    for (let column of columns) {
        schemas[column.TABLE_SCHEMA] = schemas[column.TABLE_SCHEMA] || {};
        schemas[column.TABLE_SCHEMA][column.TABLE_NAME] = schemas[column.TABLE_SCHEMA][column.TABLE_NAME] || [];
        let optional = column.IS_NULLABLE === 'YES' ? '?' : '';
        let name = column.COLUMN_NAME;
        if (column.EXTRA) {
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
                kv = `Set<${enums}>`;
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
        let type = `${column.COLUMN_NAME}${optional}: ${kv};`;
        schemas[column.TABLE_SCHEMA][column.TABLE_NAME].push({ name, type });
    }
    return schemas;
}
function writeTypescriptFile(filename, output) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield typescript_formatter_1.processString('', output.trim(), {
            replace: false,
            verify: false,
            tsconfig: false,
            tslint: false,
            editorconfig: false,
            tsfmt: true
        });
        yield fs_extra_promise_1.ensureDirAsync(path_1.dirname(filename));
        yield fs_extra_promise_1.writeFileAsync(filename, result.dest, { encoding: 'utf-8' });
    });
}
function generateTypescript(columns, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const DIR = path_1.resolve(dir);
        yield fs_extra_promise_1.removeAsync(DIR);
        yield fs_extra_promise_1.ensureDirAsync(DIR);
        let schemas = mapSchemas(columns);
        for (let schema in schemas) {
            const schemaDir = path_1.resolve(DIR, schema);
            const interfacesDir = path_1.resolve(DIR, schema, INTERFACES);
            const fieldsDir = path_1.resolve(DIR, schema, FIELDS);
            let outputTables = `
      import { ${ABSTRACT} } from '../${ABSTRACT}';
      import * as ${INTERFACES} from './${INTERFACES}';
      import * as ${FIELDS} from './${FIELDS}';
    `;
            let outputInterfaces = '';
            let outputFields = '';
            for (let table in schemas[schema]) {
                const interfaceName = `I${table}`;
                const interfaceContent = schemas[schema][table].map(col => col.type).join('\n');
                const fieldsArray = schemas[schema][table].map(col => `"${col.name}"`).join(', ');
                outputInterfaces += `
        export interface ${interfaceName} {
          ${interfaceContent}
        }
      `;
                outputFields += `
        export const ${table} = [ ${fieldsArray} ];
      `;
                outputTables += `
        export let ${table} = new ${ABSTRACT} <${INTERFACES}.${interfaceName}>(${FIELDS}.${table});
      `;
            }
            yield fs_extra_promise_1.ensureDirAsync(interfacesDir);
            yield fs_extra_promise_1.ensureDirAsync(fieldsDir);
            yield writeTypescriptFile(path_1.join(interfacesDir, INDEXD), outputInterfaces);
            yield writeTypescriptFile(path_1.join(fieldsDir, INDEX), outputFields);
            yield writeTypescriptFile(path_1.join(schemaDir, INDEX), outputTables);
        }
        yield writeTypescriptFile(path_1.join(DIR, `${ABSTRACT}.ts`), `
    export class ${ABSTRACT}<T> {
      constructor(public fields: string[]) { }
      get(fields: string[]) {}
      create(object: T) {}
      update(object: T) {}
      delete(object: T) {}
    }
  `);
        yield writeTypescriptFile(path_1.join(DIR, INDEX), `
    ${Object.keys(schemas).map(schema => `
      import * as ${schema} from './${schema}';
      export { ${schema} };
    `).join('')}
  `);
    });
}
exports.generateTypescript = generateTypescript;
;
