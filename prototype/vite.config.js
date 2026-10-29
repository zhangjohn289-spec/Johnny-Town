import {defineConfig,loadEnv} from 'vite';
import {fileURLToPath} from 'node:url';
import {localVideoPlugin} from './local-video.js';

export default defineConfig(({command,mode})=>{
  const env=loadEnv(mode,fileURLToPath(new URL('.',import.meta.url)),'LOCAL_');
  return {base:'/Johnny-Town/',define:{__LOCAL_VIDEO_ENABLED__:'false'},
    plugins:command==='serve'?[localVideoPlugin(env.LOCAL_VIDEO_FILE,'/Johnny-Town/')]:[],
  };
});
