export function audioLabel(state){return !state.supported?'声音：不可用':state.activating?'声音：启用中':state.enabled&&state.activated?(state.volume?'声音：已开启':'声音：音量为零'):state.enabled?'声音：待启用':'声音：已静音';}
export function renderAudio(root,audio){
 const description=document.createElement('p');description.textContent='声音是可选的。环境音与轻柔提示音不会影响阅读、解谜或探索。刷新后请点击启用；离开页面时暂停。';
 const toggle=document.createElement('button');toggle.id='audio-toggle';toggle.type='button';
 const label=document.createElement('label');label.htmlFor='audio-volume';label.textContent='主音量 ';
 const value=document.createElement('output');value.htmlFor='audio-volume';label.append(value);
 const volume=document.createElement('input');volume.type='range';volume.id='audio-volume';volume.min='0';volume.max='100';volume.step='1';
 const status=document.createElement('p');status.setAttribute('role','status');status.className='audio-status';
 root.append(description,toggle,label,volume,status);
 toggle.onclick=()=>{const s=audio.snapshot();if(s.enabled&&s.activated)audio.mute();else audio.enable();};
 volume.oninput=()=>audio.volume(Number(volume.value));
 return audio.subscribe(s=>{toggle.textContent=s.enabled&&s.activated?'静音':'启用声音';toggle.setAttribute('aria-pressed',String(s.enabled&&s.activated));toggle.disabled=!s.supported||s.activating;volume.value=String(s.volume);value.textContent=s.volume+'%';status.textContent=[audioLabel(s),s.warning,!s.persistent?'偏好仅在本次访问中保留。':''].filter(Boolean).join(' · ');});
}
