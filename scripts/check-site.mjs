import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=process.cwd();
async function walk(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name.startsWith('.')||entry.name==='node_modules')continue;const file=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await walk(file));else result.push(file);}return result;}
const files=await walk(root);let checked=0;
for(const file of files){
 if(/\.(mjs|js)$/.test(file)){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);}
 if(!file.endsWith('.html'))continue;
 const text=await readFile(file,'utf8');
 if(!/<title>.+<\/title>/.test(text)||!/<html lang=/.test(text))throw Error(`Missing page metadata: ${file}`);
 for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
  const target=match[1];if(/^(https?:|mailto:|data:|#)/.test(target))continue;
  const resolved=path.resolve(path.dirname(file),target.split(/[?#]/)[0]);
  if(!resolved.startsWith(root+path.sep)&&resolved!==root)throw Error(`Path outside site: ${target}`);
  try{const info=await stat(resolved);if(info.isDirectory())await stat(path.join(resolved,'index.html'));}catch{throw Error(`Broken local link: ${path.relative(root,file)} → ${target}`);}
  checked++;
 }
}
console.log(`Site check passed: ${files.filter(x=>x.endsWith('.html')).length} HTML pages; ${checked} local references; JavaScript syntax valid.`);
