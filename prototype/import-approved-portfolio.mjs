// One-time import from the owner's approved brief. No runtime file/network I/O.
import fs from 'node:fs';import crypto from 'node:crypto';
const path=process.argv[2];if(!path)throw Error('Pass the approved brief path');
const text=fs.readFileSync(path,'utf8').replaceAll('\r\n','\n');
const welcomeText=text.split('## 欢迎来到 Johnny Town！\n\n')[1].split('\n\n## 5.1 Text integrity')[0];
const portfolioText=text.split('## 关于我\n*About Me*\n\n')[1].split('\n\n# 10. Content Integrity Requirements')[0].replace(/\n\n---\s*$/,'');
const full='## 关于我\n*About Me*\n\n'+portfolioText;
const sections=full.split('\n\n---\n\n').map((s,i)=>{const match=s.match(/^## (.+)\n\*(.+)\*\n\n([\s\S]+)$/);if(!match)throw Error('Invalid approved section '+i);return {id:['about','interests','projects','skills','philosophy','explore'][i],title:match[1],english:match[2],markdown:match[3]};});
if(sections.length!==6)throw Error('Expected six approved sections');
const data={welcome:{title:'欢迎来到 Johnny Town！',markdown:welcomeText},sections};
fs.writeFileSync('prototype/src/portfolio-content.json',JSON.stringify(data,null,2)+'\n');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
fs.mkdirSync('prototype/test-fixtures',{recursive:true});
fs.writeFileSync('prototype/test-fixtures/approved-portfolio-hashes.json',JSON.stringify({welcome:hash(data.welcome.title+'\n'+welcomeText),sections:sections.map(s=>({id:s.id,hash:hash(s.title+'\n'+s.english+'\n'+s.markdown)}))},null,2)+'\n');
