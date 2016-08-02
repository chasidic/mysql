/// <reference types="bluebird" />
import { IColumn } from './InformationSchema';
export declare function generateTypescript(columns: IColumn[], dir: string): Promise<void>;
