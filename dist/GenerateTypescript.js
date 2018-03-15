"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_formatter_1 = require("typescript-formatter");
const fs_extra_promise_1 = require("fs-extra-promise");
const path_1 = require("path");
const INDEX = 'index.d.ts';
function mapSchemas(columns) {
    let schemas = {};
    for (let column of columns) {
        schemas[column.TABLE_SCHEMA] = schemas[column.TABLE_SCHEMA] || {};
        schemas[column.TABLE_SCHEMA][column.TABLE_NAME] = schemas[column.TABLE_SCHEMA][column.TABLE_NAME] || [];
        let optional = column.IS_NULLABLE === 'YES' ? ' | null' : '';
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
            case 'mediumblob':
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
        }
        let type = `${column.COLUMN_NAME}: ${kv};`;
        schemas[column.TABLE_SCHEMA][column.TABLE_NAME].push({ name, type });
    }
    return schemas;
}
function normalizeTableName(table) {
    return 'I' + table
        .replace(/^[a-z]/i, (m) => m.toUpperCase())
        .replace(/_([a-z])/ig, (m, m1) => m1.toUpperCase());
}
exports.normalizeTableName = normalizeTableName;
async function writeTypescriptFile(filename, output) {
    let result = await typescript_formatter_1.processString('', output.trim(), {
        replace: false,
        verify: false,
        tsconfig: false,
        tslint: false,
        editorconfig: false,
        tsfmt: true,
        tsconfigFile: null,
        tslintFile: null,
        tsfmtFile: null,
        vscode: false,
        vscodeFile: null
    });
    await fs_extra_promise_1.ensureDirAsync(path_1.dirname(filename));
    await fs_extra_promise_1.writeFileAsync(filename, result.dest, { encoding: 'utf-8' });
}
async function generateTypescript(columns, dir) {
    const DIR = path_1.resolve(dir);
    await fs_extra_promise_1.removeAsync(DIR);
    await fs_extra_promise_1.ensureDirAsync(DIR);
    let schemas = mapSchemas(columns);
    for (let schema in schemas) {
        const schemaDir = path_1.resolve(DIR, schema);
        let outputInterfaces = '';
        for (let table in schemas[schema]) {
            const interfaceName = normalizeTableName(table);
            const interfaceContent = schemas[schema][table].map(col => col.type).join('\n');
            outputInterfaces += `
        export interface ${interfaceName} {
          ${interfaceContent}
        }
      `;
        }
        await fs_extra_promise_1.ensureDirAsync(schemaDir);
        await writeTypescriptFile(path_1.join(schemaDir, INDEX), outputInterfaces);
    }
    await writeTypescriptFile(path_1.join(DIR, INDEX), `
    ${Object.keys(schemas).map(schema => `
      import * as ${schema} from './${schema}';
      export { ${schema} };
    `).join('')}
  `);
}
exports.generateTypescript = generateTypescript;
