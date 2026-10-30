export const BILIBILI_URL='https://www.bilibili.com/video/BV1GJ411x7h7/';
export function renderChestLink(root){
 const p=document.createElement('p');p.textContent='宝箱里藏着一条通往站外的线索。准备好再打开吧。';root.append(p);
 const link=document.createElement('a');link.href=BILIBILI_URL;link.target='_blank';link.rel='noopener noreferrer';link.textContent='打开 Bilibili 视频';root.append(link);
 const hint=document.createElement('p');hint.setAttribute('role','status');hint.textContent='将在新标签页打开。若浏览器拦截，可复制下方地址后手动访问。';root.append(hint);
 link.addEventListener('click',()=>{hint.textContent='若新标签页未打开或站外页面无法加载，请复制下方地址手动访问。游戏仍在当前标签页。';});
 const address=document.createElement('input');address.readOnly=true;address.value=BILIBILI_URL;address.setAttribute('aria-label','Bilibili 视频地址，可选择并复制');address.style.width='100%';root.append(address);
}
