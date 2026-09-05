import { createSvgIconFromRaw } from './base';

import folderSvg from './svg/folder.svg?raw';
import homeSvg from './svg/home.svg?raw';
import fileSvg from './svg/file.svg?raw';
import fileCodeSvg from './svg/file-code.svg?raw';
import fileTextSvg from './svg/file-text.svg?raw';
import fileSpreadsheetSvg from './svg/file-spreadsheet.svg?raw';
import bookOpenSvg from './svg/book-open.svg?raw';
import code2Svg from './svg/code-2.svg?raw';

export const Folder = createSvgIconFromRaw(folderSvg, 'Folder');
export const Home = createSvgIconFromRaw(homeSvg, 'Home');
export const File = createSvgIconFromRaw(fileSvg, 'File');
export const FileCode = createSvgIconFromRaw(fileCodeSvg, 'FileCode');
export const FileText = createSvgIconFromRaw(fileTextSvg, 'FileText');
export const FileSpreadsheet = createSvgIconFromRaw(fileSpreadsheetSvg, 'FileSpreadsheet');
export const BookOpen = createSvgIconFromRaw(bookOpenSvg, 'BookOpen');
export const Code2 = createSvgIconFromRaw(code2Svg, 'Code2');
