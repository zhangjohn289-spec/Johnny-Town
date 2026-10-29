import fs from 'node:fs';
const html=fs.readFileSync('prototype/dist/index.html','utf8');
const paths=[...html.matchAll(/(?:src|href)="((?:\/Johnny-Town\/|\.\/)assets\/[^"]+)"/g)].map(x=>x[1]);
if(!paths.length||paths.some(p=>!fs.existsSync('prototype/dist/'+p.replace(/^\/Johnny-Town\//,'').replace(/^\.\//,''))))process.exit(1);
if(!html.includes('/Johnny-Town/assets/'))throw Error('Expected exact GitHub Pages repository base');
console.log('GitHub Pages asset paths passed',paths);
