
let guests=[];
fetch('guests.json').then(r=>r.json()).then(d=>guests=d);

function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}

function searchGuest(){
 const f=norm(document.getElementById('first').value);
 const l=norm(document.getElementById('last').value);
 const g=guests.find(x=>norm(String(x.first_name))===f && norm(String(x.last_name))===l);
 const r=document.getElementById('result');
 if(!g){r.innerHTML='Nie znaleziono na liście.'; return;}
 r.innerHTML=`<p>Twoje miejsce znajduje się przy stoliku</p><div class="big">${g.table}</div>`;
}
