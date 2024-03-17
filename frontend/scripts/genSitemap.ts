import fs from 'fs';
import path from 'path';
import { genSiteMap } from '../src/lib/sitemap';

// console.log('Writing sitemap.xml', output);
fs.writeFileSync(path.resolve('./frontend/public/sitemap.xml'), genSiteMap());
