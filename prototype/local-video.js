import {createReadStream,accessSync,constants,statSync} from 'node:fs';

export function parseRange(header,size) {
  if(!header) return null;
  const match=/^bytes=(\d*)-(\d*)$/.exec(header);
  if(!match || (!match[1]&&!match[2])) return false;
  let start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
  let end=match[1]?(match[2]?Math.min(Number(match[2]),size-1):size-1):size-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size||(!match[1]&&Number(match[2])===0)) return false;
  return {start,end};
}

export function localVideoPlugin(file,base) {
  let size=0;
  if(file) {
    try {accessSync(file,constants.R_OK);const stat=statSync(file);if(stat.isFile()&&/\.mp4$/i.test(file)) size=stat.size;}
    catch {console.warn('[local-video] Local MP4 unavailable; development player will use the public fallback.');}
  }
  return {
    name:'local-video-only',apply:'serve',
    config:()=>({define:{__LOCAL_VIDEO_ENABLED__:JSON.stringify(size>0)}}),
    configureServer(server) {
      if(!size) return;
      console.info('[local-video] Development-only MP4 enabled; original file is streamed, never copied.');
      server.middlewares.use((req,res,next)=>{
        if(req.url?.split('?')[0]!==base+'__local-video') return next();
        res.setHeader('Cache-Control','no-store');
        res.setHeader('Cross-Origin-Resource-Policy','same-origin');
        if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;res.end();return;}
        const range=parseRange(req.headers.range,size);
        if(range===false){res.statusCode=416;res.setHeader('Content-Range',`bytes */${size}`);res.end();return;}
        const {start,end}=range||{start:0,end:size-1};
        res.statusCode=range?206:200;
        res.setHeader('Content-Type','video/mp4');res.setHeader('Accept-Ranges','bytes');
        res.setHeader('Content-Length',end-start+1);
        if(range) res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
        if(req.method==='HEAD'){res.end();return;}
        const stream=createReadStream(file,{start,end});
        stream.on('error',()=>{if(!res.headersSent){res.removeHeader('Content-Length');res.statusCode=503;res.end('Local video unavailable');}else res.destroy();});
        res.on('close',()=>stream.destroy());stream.pipe(res);
      });
    },
  };
}
