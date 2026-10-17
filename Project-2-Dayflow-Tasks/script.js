(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const STORAGE_KEY = "dayflow.v1";
  const state = { tasks: [], notes: [], view: "all", filter: "open", editingTask: null, editingNote: null, search: "", sort: "created" };
  const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const safeDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}) : "";
  const niceTime = value => new Date(value).toLocaleString(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
  const isOverdue = task => !task.done && task.due && task.due < todayISO();
  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tasks":[],"notes":[]}');
      state.tasks = Array.isArray(parsed.tasks) ? parsed.tasks.filter(t => t && t.id && t.title) : [];
      state.notes = Array.isArray(parsed.notes) ? parsed.notes.filter(n => n && n.id) : [];
    } catch (error) {
      toast("Saved data could not be read. You can import a backup if you have one.");
      state.tasks = []; state.notes = [];
    }
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({version:1,tasks:state.tasks,notes:state.notes,updatedAt:new Date().toISOString()})); return true; }
    catch (error) { toast("Browser storage is full or unavailable. Export a backup and free some space."); return false; }
  }
  function toast(message) {
    const el = document.createElement("div"); el.className = "toast"; el.textContent = message; $("#toastRegion").append(el);
    setTimeout(() => el.remove(), 3200);
  }
  let pendingConfirmation = null;
  function confirmAction(title, message, label, action) {
    const dialog = $("#confirmDialog");
    $("#dialogTitle").textContent = title;
    $("#dialogMessage").textContent = message;
    $("#dialogConfirm").textContent = label;
    pendingConfirmation = action;
    if (!dialog.open) dialog.showModal();
  }
  $("#dialogConfirm").addEventListener("click", event => {
    event.preventDefault();
    const action = pendingConfirmation;
    pendingConfirmation = null;
    $("#confirmDialog").close();
    if (action) action();
  });
  $("#confirmDialog").addEventListener("close", () => { pendingConfirmation = null; });
  function counts() {
    const total = state.tasks.length, done = state.tasks.filter(t=>t.done).length, today = state.tasks.filter(t=>!t.done && t.due===todayISO()).length;
    $("#allCount").textContent = total; $("#todayCount").textContent = today; $("#openCount").textContent = total-done;
    $("#statTotal").textContent = total; $("#statDone").textContent = done; $("#statToday").textContent = today;
    const percent = total ? Math.round(done/total*100) : 0;
    $("#statPercent").textContent = `${percent}%`; $("#progressBar").style.width = `${percent}%`;
    $("#focusPercent").textContent = `${percent}%`; $("#focusCircle").style.background = `conic-gradient(var(--primary) ${percent*3.6}deg,#eeedfa 0deg)`;
    $("#focusOpen").textContent = total-done; $("#focusDone").textContent = done;
    $("#focusCaption").textContent = total===0 ? "Start with one small task." : percent===100 ? "Everything is done. Enjoy the breathing room!" : percent>=70 ? "You're building great momentum." : "One step at a time. You've got this.";
  }
  function currentTasks() {
    let tasks = [...state.tasks];
    if (state.view==="today") tasks = tasks.filter(t=>t.due===todayISO()&&!t.done);
    if (state.view==="upcoming") tasks = tasks.filter(t=>t.due&&t.due>todayISO()&&!t.done);
    if (state.view==="completed") tasks = tasks.filter(t=>t.done);
    if (state.view==="notes") tasks = [];
    if (state.filter==="open") tasks = tasks.filter(t=>!t.done);
    if (state.filter==="done") tasks = tasks.filter(t=>t.done);
    if (state.search.trim()) { const q=state.search.toLowerCase(); tasks=tasks.filter(t=>[t.title,t.details,t.category,t.priority].some(v=>String(v||"").toLowerCase().includes(q))); }
    const priorityOrder={high:0,medium:1,low:2};
    tasks.sort((a,b)=> state.sort==="due" ? ((a.due||"9999").localeCompare(b.due||"9999")) : state.sort==="priority" ? priorityOrder[a.priority]-priorityOrder[b.priority] : state.sort==="title" ? a.title.localeCompare(b.title) : (b.createdAt||"").localeCompare(a.createdAt||""));
    return tasks;
  }
  function renderTasks() {
    const list=$("#taskList"); const tasks=currentTasks();
    const headings={all:["All tasks","Plan it, do it, feel good about it."],today:["Today","A clear plan for the day ahead."],upcoming:["Upcoming","See what's coming up next."],completed:["Completed","Look at everything you've accomplished."],notes:["Notes","Capture and revisit your ideas."]};
    $("#viewTitle").textContent=headings[state.view][0]; $("#listHeading").textContent=state.view==="all"?"Your tasks":headings[state.view][0]; $("#listSubheading").textContent=headings[state.view][1];
    $$(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view));
    $$(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===state.filter));
    $("#taskForm").classList.toggle("hidden",state.view==="notes");
    if(state.view==="notes"){list.innerHTML='<div class="empty-state"><div class="empty-icon">▧</div><strong>Your notes live on the right</strong><p>Use Quick notes to save ideas and reminders.</p></div>';$("#listSummary").textContent=`${state.notes.length} notes`;return;}
    if(!tasks.length){const hasAny=state.tasks.length>0;const title=state.search?"No matching tasks":state.view==="completed"?"No completed tasks yet":state.filter==="done"?"Nothing completed yet":"You're all caught up";const msg=state.search?"Try another keyword or clear your search.":hasAny?"Try another filter, or add a new task.":"Add your first task to get started.";list.innerHTML=`<div class="empty-state"><div class="empty-icon">${state.search?"⌕":"✓"}</div><strong>${title}</strong><p>${msg}</p></div>`;}
    else list.innerHTML=tasks.map(t=>`<article class="task-row ${t.done?"is-done":""}" data-task-id="${escapeHTML(t.id)}"><input class="task-check" type="checkbox" aria-label="Mark ${escapeHTML(t.title)} complete" ${t.done?"checked":""} data-action="toggle"><div class="task-content"><div class="task-title">${escapeHTML(t.title)}</div>${t.details?`<div class="task-details">${escapeHTML(t.details)}</div>`:""}<div class="task-meta"><span class="meta-pill priority-${escapeHTML(t.priority||"medium")}">${escapeHTML((t.priority||"medium").toUpperCase())}</span><span class="meta-pill">${escapeHTML(t.category||"Personal")}</span>${t.due?`<span class="meta-pill ${isOverdue(t)?"due-overdue":""}">${isOverdue(t)?"Overdue · ":""}${escapeHTML(safeDate(t.due))}</span>`:""}</div></div><div class="task-actions"><button title="Edit task" aria-label="Edit ${escapeHTML(t.title)}" data-action="edit">✎</button><button title="Delete task" aria-label="Delete ${escapeHTML(t.title)}" data-action="delete">×</button></div></article>`).join("");
    $("#listSummary").textContent=`Showing ${tasks.length} task${tasks.length===1?"":"s"}`;
    $("#toggleSelectDone").textContent=tasks.length&&tasks.every(t=>t.done)?"Mark all visible open":"Mark all visible done";
  }
  function renderNotes(){
    const list=$("#notesList");
    if(!state.notes.length){list.innerHTML='<div class="no-notes">No notes yet. Save a thought above.</div>';return;}
    list.innerHTML=[...state.notes].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).map(n=>`<article class="note-card" data-note-id="${escapeHTML(n.id)}"><div class="note-card-head"><strong>${escapeHTML(n.title||"Untitled note")}</strong><div class="note-card-actions"><button data-note-action="edit" aria-label="Edit note">✎</button><button data-note-action="delete" aria-label="Delete note">×</button></div></div>${n.body?`<p>${escapeHTML(n.body)}</p>`:""}<small class="note-time">Updated ${escapeHTML(n.updatedAt?niceTime(n.updatedAt):"just now")}</small></article>`).join("");
  }
  function render(){counts();renderTasks();renderNotes();}
  function openTaskForm(task=null){
    state.editingTask=task?task.id:null;$("#taskForm").classList.remove("hidden");$("#formHeading").textContent=task?"Edit task":"Create a task";$("#saveTaskBtn").textContent=task?"Save changes":"Save task";
    $("#taskTitle").value=task?.title||"";$("#taskDetails").value=task?.details||"";$("#taskDue").value=task?.due||"";$("#taskPriority").value=task?.priority||"medium";$("#taskCategory").value=task?.category||"Personal";$("#taskTitle").focus();
  }
  function resetTaskForm(){$("#taskForm").reset();$("#taskForm").classList.add("hidden");state.editingTask=null;$("#taskPriority").value="medium";}
  $("#taskForm").addEventListener("submit",e=>{
    e.preventDefault();const title=$("#taskTitle").value.trim();if(!title){$("#taskTitle").focus();return;}
    const payload={title,details:$("#taskDetails").value.trim(),due:$("#taskDue").value,priority:$("#taskPriority").value,category:$("#taskCategory").value};
    if(state.editingTask){const t=state.tasks.find(x=>x.id===state.editingTask);if(t)Object.assign(t,payload,{updatedAt:new Date().toISOString()});toast("Task updated.");}
    else{state.tasks.unshift({id:uid(),...payload,done:false,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});toast("Task added.");}
    persist();resetTaskForm();render();
  });
  $("#quickAddBtn").addEventListener("click",()=>openTaskForm());$("#showAddForm").addEventListener("click",()=>openTaskForm());$("#closeForm").addEventListener("click",resetTaskForm);$("#cancelForm").addEventListener("click",resetTaskForm);
  $("#taskList").addEventListener("change",e=>{const row=e.target.closest("[data-task-id]");if(!row||e.target.dataset.action!=="toggle")return;const task=state.tasks.find(t=>t.id===row.dataset.taskId);if(task){task.done=e.target.checked;task.updatedAt=new Date().toISOString();persist();render();toast(task.done?"Nice work — task completed.":"Task moved back to your list.");}});
  $("#taskList").addEventListener("click",e=>{const btn=e.target.closest("button[data-action]");if(!btn)return;const row=btn.closest("[data-task-id]");const task=state.tasks.find(t=>t.id===row?.dataset.taskId);if(!task)return;if(btn.dataset.action==="edit")openTaskForm(task);if(btn.dataset.action==="delete")confirmAction("Delete this task?","This task will be permanently removed from this browser.","Delete task",()=>{state.tasks=state.tasks.filter(t=>t.id!==task.id);persist();render();toast("Task deleted.");});});
  $$(".nav-item[data-view]").forEach(b=>b.addEventListener("click",()=>{state.view=b.dataset.view;state.filter=state.view==="completed"?"done":"open";render();if(innerWidth<=900)$("#sidebar").classList.remove("open");}));
  $$(".filter-tab").forEach(b=>b.addEventListener("click",()=>{state.filter=b.dataset.filter;renderTasks();}));
  $("#taskSearch").addEventListener("input",e=>{state.search=e.target.value;renderTasks();});$("#taskSort").addEventListener("change",e=>{state.sort=e.target.value;renderTasks();});
  $("#toggleSelectDone").addEventListener("click",()=>{const tasks=currentTasks();if(!tasks.length)return;const makeDone=!tasks.every(t=>t.done);tasks.forEach(t=>{t.done=makeDone;t.updatedAt=new Date().toISOString();});persist();render();toast(makeDone?"Visible tasks marked complete.":"Visible tasks reopened.");});
  $("#noteForm").addEventListener("submit",e=>{e.preventDefault();const title=$("#noteTitle").value.trim(),body=$("#noteBody").value.trim();if(!title&&!body){toast("Write a title or some note content first.");return;}if(state.editingNote){const n=state.notes.find(x=>x.id===state.editingNote);if(n)Object.assign(n,{title:title||"Untitled note",body,updatedAt:new Date().toISOString()});}else state.notes.unshift({id:uid(),title:title||"Untitled note",body,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});persist();state.editingNote=null;$("#noteForm").reset();$("#noteStatus").textContent="Auto-saved when you save";renderNotes();toast("Note saved.");});
  $("#notesList").addEventListener("click",e=>{const btn=e.target.closest("button[data-note-action]");if(!btn)return;const card=btn.closest("[data-note-id]"),note=state.notes.find(n=>n.id===card.dataset.noteId);if(!note)return;if(btn.dataset.noteAction==="edit"){state.editingNote=note.id;$("#noteTitle").value=note.title;$("#noteBody").value=note.body;$("#noteStatus").textContent="Editing saved note";$("#noteTitle").focus();}else confirmAction("Delete this note?","This note will be permanently removed.","Delete note",()=>{state.notes=state.notes.filter(n=>n.id!==note.id);persist();renderNotes();toast("Note deleted.");});});
  $("#newNoteBtn").addEventListener("click",()=>{state.editingNote=null;$("#noteForm").reset();$("#noteStatus").textContent="Creating a new note";$("#noteTitle").focus();});
  $("#clearCompletedBtn").addEventListener("click",()=>{const count=state.tasks.filter(t=>t.done).length;if(!count){toast("There are no completed tasks to clear.");return;}confirmAction("Clear completed tasks?",`${count} completed task${count===1?"":"s"} will be removed. Consider exporting a backup first.`,"Clear tasks",()=>{state.tasks=state.tasks.filter(t=>!t.done);persist();render();toast("Completed tasks cleared.");});});
  $("#exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({app:"Dayflow",version:1,exportedAt:new Date().toISOString(),tasks:state.tasks,notes:state.notes},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`dayflow-backup-${todayISO()}.json`;a.click();URL.revokeObjectURL(url);toast("Backup exported.");});
  $("#importInput").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.tasks)||!Array.isArray(data.notes))throw new Error("Invalid backup");confirmAction("Import this backup?",`This replaces the current ${state.tasks.length} task(s) and ${state.notes.length} note(s) with ${data.tasks.length} task(s) and ${data.notes.length} note(s). Export your current data first if you need it.`,"Replace data",()=>{state.tasks=data.tasks.filter(t=>t&&t.id&&t.title);state.notes=data.notes.filter(n=>n&&n.id);persist();render();toast("Backup imported.");});}catch(err){toast("That file is not a valid Dayflow backup.");}finally{e.target.value="";}});
  $("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  $("#profileBtn").addEventListener("click",()=>toast("Dayflow stores tasks and notes locally in this browser. Export a backup to move them to another device."));
  function updateDate(){const d=new Date();$("#headerDate").textContent=d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});const h=d.getHours();$("#greeting").textContent=h<12?"GOOD MORNING":h<17?"GOOD AFTERNOON":"GOOD EVENING";}
  load();updateDate();render();
})();