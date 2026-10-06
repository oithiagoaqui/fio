const KEY = "fio-data-v1";

const seed = {
  version: 1,
  projects: [{
    id: crypto.randomUUID(),
    name: "Orçamento — sala acústica",
    createdAt: Date.now(),
    tasks: [{
      id: crypto.randomUUID(),
      name: "Orçamento — sala acústica",
      stages: [
        {id:crypto.randomUUID(), name:"Arquivos", done:true},
        {id:crypto.randomUUID(), name:"Medidas (salas 1 a 4)", done:true},
        {id:crypto.randomUUID(), name:"Sala 5 — conferir medida", done:false},
        {id:crypto.randomUUID(), name:"Planilha", done:false},
        {id:crypto.randomUUID(), name:"Revisão", done:false},
        {id:crypto.randomUUID(), name:"Enviar", done:false}
      ],
      current: 2,
      stopNote: "A medida está na planta impressa.",
      stopAt: Date.now()
    }]
  }]
};

let data = load();
let view = "tasks";
let selectedTask = null;
let wheelOffset = 0;
let dragStartX = null;

const app = document.querySelector("#app");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modalContent");

function load(){
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : structuredClone(seed);
  } catch(e){ return structuredClone(seed); }
}
function save(){
  localStorage.setItem(KEY, JSON.stringify(data));
}
function esc(s=""){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function toast(msg){
  const el=document.querySelector("#toast"); el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}
function findTask(id){
  for(const p of data.projects){ const t=p.tasks.find(t=>t.id===id); if(t) return {p,t}; }
}
function progress(t){ return t.stages.filter(s=>s.done).length; }

function render(){
  if(view==="tasks") renderTasks();
  if(view==="data") renderData();
  if(view==="create") renderCreate();
  if(view==="task") renderTask();
  if(view==="resume") renderResume();
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
}

function renderTasks(){
  const all=data.projects.flatMap(p=>p.tasks);
  app.innerHTML = `
    <div class="decor"></div>
    <div class="topline">
      <div><div class="eyebrow">SEU ESPAÇO DE TRABALHO</div><h1>Projetos e tarefas</h1></div>
      <button class="plus-link" id="newTask">＋ Nova tarefa</button>
    </div>
    ${all.length ? all.map(t=>{
      const pr=progress(t), total=t.stages.length;
      return `<article class="project-card ${t.current<total?'active':''}" data-id="${t.id}">
        <div class="project-head">
          <div>
            <div class="eyebrow">PROJETO</div>
            <div class="project-name">${esc(t.name)}</div>
            <div class="progress-text">${pr}/${total} etapas</div>
          </div>
          <div class="mini-orbit">${t.stages.map((s,i)=>`<i class="${s.done?'current':''}"></i>`).join("")}</div>
        </div>
        <div class="stage-list">
          ${t.stages.map((s,i)=>`<div class="stage-row ${s.done?'done':''} ${i===t.current&&!s.done?'current':''}">
            <span class="status">${s.done?'✓':''}</span><span>${esc(s.name)}</span>
            <span class="stage-state">${s.done?'concluída':i===t.current?'em andamento':''}</span>
          </div>`).join("")}
        </div>
        <div class="card-actions"><button class="text-btn open-task">Abrir tarefa →</button></div>
      </article>`;
    }).join("") : `<div class="empty"><div class="drawing">FIO</div><h2>Nenhuma tarefa ainda.</h2><p class="muted">Crie uma tarefa e divida o caminho em pequenos passos.</p><button class="primary" id="newTaskEmpty">Criar primeira tarefa</button></div>`}
  `;
  document.querySelector("#newTask")?.addEventListener("click",()=>{view="create";render()});
  document.querySelector("#newTaskEmpty")?.addEventListener("click",()=>{view="create";render()});
  document.querySelectorAll(".open-task").forEach(b=>b.addEventListener("click",e=>{
    selectedTask=e.target.closest(".project-card").dataset.id; view="task"; wheelOffset=0; render();
  }));
}

function renderCreate(){
  app.innerHTML=`
    <button class="back-btn" id="back">← Voltar</button>
    <div class="topline"><div><div class="eyebrow">NOVA TAREFA</div><h1>Comece pelo que precisa fazer.</h1></div></div>
    <form class="form" id="createForm">
      <div><label for="taskName">Nome da tarefa ou projeto</label><input id="taskName" required placeholder="Ex.: Preparar orçamento da obra"></div>
      <div>
        <label>Etapas</label>
        <div class="stage-editor" id="stageEditor">
          ${["Localizar arquivos","Conferir medidas","Preencher planilha","Revisar","Enviar"].map((x,i)=>stageInput(x,i)).join("")}
        </div>
        <button type="button" class="text-btn" id="addStage">＋ adicionar etapa</button>
      </div>
      <div class="form-actions"><button type="button" class="secondary" id="cancelCreate">Cancelar</button><button class="primary">Começar</button></div>
    </form>`;
  document.querySelector("#back").onclick=document.querySelector("#cancelCreate").onclick=()=>{view="tasks";render()};
  document.querySelector("#addStage").onclick=()=>{document.querySelector("#stageEditor").insertAdjacentHTML("beforeend",stageInput("",document.querySelectorAll(".stage-edit").length))};
  document.querySelector("#createForm").onsubmit=e=>{
    e.preventDefault();
    const name=document.querySelector("#taskName").value.trim();
    const stages=[...document.querySelectorAll(".stage-edit input")].map(x=>x.value.trim()).filter(Boolean).map(n=>({id:crypto.randomUUID(),name:n,done:false}));
    if(!name||!stages.length){toast("Adicione um nome e pelo menos uma etapa.");return}
    const task={id:crypto.randomUUID(),name,stages,current:0,stopNote:"",stopAt:null};
    data.projects.unshift({id:crypto.randomUUID(),name,createdAt:Date.now(),tasks:[task]});
    save();selectedTask=task.id;view="task";render();
  };
}
function stageInput(value,i){return `<div class="stage-edit"><input value="${esc(value)}" placeholder="Etapa ${i+1}"><button type="button" class="small-btn" onclick="this.parentElement.remove()">×</button></div>`}

function renderTask(){
  const found=findTask(selectedTask); if(!found){view="tasks";render();return}
  const {t}=found;
  const n=t.stages.length, current=Math.min(t.current,n-1);
  const angleStep=360/n;
  app.innerHTML=`
    <section class="hero-task">
      <button class="back-btn" id="back">← Tarefas</button>
      <div class="task-title"><div class="eyebrow">PROJETO</div><h1>${esc(t.name)}</h1></div>
      <div class="wheel-wrap" id="wheelWrap">
        <div class="wheel" id="wheel"></div>
        <div class="wheel-center">
          <div>
            <div class="center-label">${t.stages[current].done?'ETAPA CONCLUÍDA':'VOCÊ ESTÁ AQUI'}</div>
            <div class="center-main">${esc(t.stages[current].name)}</div>
            <div class="center-next">${current<n-1 ? 'Próximo: '+esc(t.stages[current+1].name) : 'Última etapa da tarefa'}</div>
          </div>
        </div>
      </div>
      <div class="wheel-hint">Arraste a roda ou use os botões para navegar entre as etapas.</div>
      <div class="task-actions">
        <button class="primary full" id="complete">${t.stages[current].done ? 'Etapa já concluída' : 'Concluir etapa'}</button>
        <button class="pause" id="pause">Ⅱ &nbsp; Parei aqui</button>
      </div>
      <div class="swipe-note">O aplicativo guarda o ponto para você.</div>
      <div class="task-meta">
        <div class="meta-box"><div class="eyebrow">ETAPAS</div><div class="meta-value">${progress(t)} de ${n} concluídas</div></div>
        <div class="meta-box"><div class="eyebrow">ÚLTIMA PARADA</div><div class="meta-value">${t.stopAt ? new Date(t.stopAt).toLocaleDateString("pt-BR") : "Ainda não registrada"}</div></div>
      </div>
    </section>`;
  const wheel=document.querySelector("#wheel");
  t.stages.forEach((s,i)=>{
    const a=(i-current)*angleStep-90;
    const r=40;
    const x=50+Math.cos(a*Math.PI/180)*r, y=50+Math.sin(a*Math.PI/180)*r;
    const node=document.createElement("div");
    node.className=`wheel-node ${i===current&&!s.done?'current':''} ${s.done?'done':''}`;
    node.style.left=x+"%";node.style.top=y+"%";
    node.innerHTML=`<div class="node-dot">${s.done?'✓':i+1}</div><div class="node-label">${esc(s.name)}</div>`;
    node.onclick=()=>{t.current=i;save();render()};
    wheel.appendChild(node);
  });
  document.querySelector("#back").onclick=()=>{view="tasks";render()};
  document.querySelector("#complete").onclick=()=>{
    if(!t.stages[current].done){t.stages[current].done=true;if(current<n-1)t.current=current+1;save();render();toast("Etapa concluída. O fio avançou.");}
  };
  document.querySelector("#pause").onclick=()=>openPause(t,current);
  const wrap=document.querySelector("#wheelWrap");
  wrap.addEventListener("pointerdown",e=>{dragStartX=e.clientX;wrap.setPointerCapture(e.pointerId)});
  wrap.addEventListener("pointerup",e=>{
    if(dragStartX===null)return;
    const dx=e.clientX-dragStartX;
    if(Math.abs(dx)>35){
      const dir=dx<0?1:-1;
      t.current=Math.max(0,Math.min(n-1,t.current+dir));save();render();
    }
    dragStartX=null;
  });
}

function openPause(t,current){
  modalContent.innerHTML=`<div class="modal">
    <div class="eyebrow">PAREI AQUI</div><h2>Deixe um bilhete para depois.</h2>
    <p>O aplicativo já sabe qual é a etapa atual. Escreva só o que você não quer precisar reconstruir quando voltar.</p>
    <label>O que é importante lembrar?</label>
    <textarea id="pauseNote" placeholder="Ex.: a medida está na planta impressa.">${esc(t.stopNote||"")}</textarea>
    <div class="modal-actions"><button class="secondary" id="closeModal">Cancelar</button><button class="primary" id="savePause">Salvar e sair</button></div>
  </div>`;
  modal.showModal();
  document.querySelector("#closeModal").onclick=()=>modal.close();
  document.querySelector("#savePause").onclick=()=>{
    t.stopNote=document.querySelector("#pauseNote").value.trim();t.stopAt=Date.now();save();modal.close();view="resume";render();
  };
}

function renderResume(){
  const found=findTask(selectedTask);if(!found){view="tasks";render();return}
  const {t}=found, current=Math.min(t.current,t.stages.length-1);
  app.innerHTML=`<section class="resume">
    <button class="back-btn" id="back">← Tarefas</button>
    <h1>Você estava aqui.</h1>
    <div class="resume-project">${esc(t.name)}</div>
    <div class="timeline">
      ${t.stages.map((s,i)=>`<div class="timeline-item ${s.done?'done':''} ${i===current&&!s.done?'current':''}">
        <div class="timeline-name">${esc(s.name)}</div>
        <div class="timeline-state">${s.done?'concluída':i===current?'você está aqui':''}</div>
      </div>`).join("")}
    </div>
    <div class="info-block"><div class="info-title">◷ &nbsp; Próximo passo</div><div class="info-body">${esc(t.stages[current]?.name||"Concluir tarefa")}</div></div>
    <div class="info-block"><div class="info-title">▤ &nbsp; Para lembrar</div><div class="info-body">${esc(t.stopNote||"Você não deixou uma observação desta vez.")}</div></div>
    <div class="task-actions" style="margin-top:22px"><button class="primary" id="continue">Continuar</button><button class="secondary" id="editStop">Editar ponto de parada</button></div>
  </section>`;
  document.querySelector("#back").onclick=()=>{view="tasks";render()};
  document.querySelector("#continue").onclick=()=>{view="task";render()};
  document.querySelector("#editStop").onclick=()=>openPause(t,current);
}

function renderData(){
  app.innerHTML=`<section class="data-page">
    <div class="eyebrow">SEUS DADOS</div><h1>Dados e backup</h1>
    <p class="muted">Seus dados ficam neste dispositivo. Faça uma cópia quando quiser.</p>
    <div class="data-section"><h3>Exportar</h3><p>Cria um arquivo JSON com seus projetos, etapas e pontos de parada.</p><button class="primary" id="export">Exportar meus dados</button></div>
    <div class="data-section"><h3>Importar</h3><p>Restaura uma cópia anterior. Os dados atuais serão substituídos.</p><label class="file-label">Escolher arquivo JSON<input id="import" type="file" accept="application/json,.json"></label></div>
    <div class="data-section"><h3>Privacidade</h3><p>O FIO não precisa de conta, login ou banco de dados externo para funcionar. Esta versão guarda os dados no armazenamento local do navegador.</p></div>
    <div class="data-section"><button class="secondary" id="reset">Restaurar dados de demonstração</button></div>
  </section>`;
  document.querySelector("#export").onclick=()=>{
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url;a.download=`fio-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast("Backup exportado.");
  };
  document.querySelector("#import").onchange=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const imported=JSON.parse(reader.result);
        if(!imported.projects||!Array.isArray(imported.projects))throw new Error();
        data=imported;save();view="tasks";render();toast("Dados importados com sucesso.");
      }catch{toast("Esse arquivo não parece ser um backup do FIO.")}
    };reader.readAsText(file);
  };
  document.querySelector("#reset").onclick=()=>{
    if(confirm("Restaurar o exemplo? Os dados atuais serão substituídos.")){data=structuredClone(seed);save();view="tasks";render();toast("Demonstração restaurada.")}
  };
}

document.querySelector("#brandHome").onclick=()=>{view="tasks";render()};
document.querySelector("#settingsBtn").onclick=()=>{view="data";render()};
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{view=b.dataset.view;render()});

render();
