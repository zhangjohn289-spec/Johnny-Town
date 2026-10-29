const panel=document.querySelector('#panel');
export function show(place,onClose){document.querySelector('#title').textContent=place.name;document.querySelector('#body').textContent=place.text;panel.onclose=onClose;panel.showModal();document.querySelector('#close').focus();}
document.querySelector('#close').onclick=()=>panel.close();
export const isOpen=()=>panel.open;
