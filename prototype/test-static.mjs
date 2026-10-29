import fs from 'node:fs';
const html=fs.readFileSync('prototype/dist/index.html','utf8');
const paths=[...html.matchAll(/src="(\.\/assets\/[^"]+)"/g)].map(x=>x[1]);
if(!paths.length||paths.some(p=>!fs.existsSync('prototype/dist/'+p)))process.exit(1);
console.log('Static relative asset check passed',paths);
