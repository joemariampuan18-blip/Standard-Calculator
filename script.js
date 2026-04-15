// Basic calculator functionality
const displayEl = document.getElementById('display');
const buttons = Array.from(document.querySelectorAll('.btn'));
let expr = '';
let lastChar = '';
let memoryA = null;
let memoryB = null;
// modal elements (modal markup is included near the end of the page)
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function updateDisplay(v){
  displayEl.textContent = v === '' ? '0' : v;
}

function appendValue(val){
  if (expr.length > 30) return; // limit
  expr += val;
  lastChar = val;
  updateDisplay(expr);
}

function pushOperator(op){
  if (!expr) return; // ignore operator at start
  const last = expr[expr.length-1];
  if ('+-*/'.includes(last)){
    // replace last operator
    expr = expr.slice(0,-1) + op;
  } else {
    expr += op;
  }
  updateDisplay(expr);
}

function calculate(){
  if (!expr) return;
  try{
    // sanitize
    const safe = expr.replace(/×/g,'*').replace(/÷/g,'/');
    // avoid accidental characters
    if (/[^0-9+\-*/(). ]/.test(safe)) throw new Error('Invalid');
    // use Function instead of eval for a bit more safety
    const result = Function('return (' + safe + ')')();
    expr = String(result);
    updateDisplay(expr);
  }catch(e){
    updateDisplay('Error');
    expr = '';
  }
}

function clearAll(){
  expr = '';
  updateDisplay('0');
}

// wire up buttons
buttons.forEach(btn => {
  btn.addEventListener('click', (e)=>{
    const v = btn.getAttribute('data-value');
    if (btn.id === 'clear'){
      clearAll();
      return;
    }
    if (btn.id === 'equals'){
      calculate();
      return;
    }
    if (btn.id === 'memA'){
      // show developer modal
      showDeveloper();
      return;
    }
    if (btn.id === 'memB'){
      // show application modal
      showApplication();
      return;
    }

    if (v){
      if ('+-*/'.includes(v)){
        pushOperator(v);
      } else {
        appendValue(v);
      }
    }
  });
});

function flashHint(text){
  const hint = document.querySelector('.hint');
  const prev = hint.textContent;
  hint.textContent = text;
  hint.style.opacity = '1';
  setTimeout(()=>{ hint.textContent = prev; }, 1300);
}

// keyboard support
window.addEventListener('keydown', (e)=>{
  const key = e.key;
  if ((/^[0-9]$/).test(key)) appendValue(key);
  if (key === '+') pushOperator('+');
  if (key === '-') pushOperator('-');
  if (key === '*') pushOperator('*');
  if (key === '/') pushOperator('/');
  if (key === 'Enter' || key === '=') calculate();
  if (key === 'Backspace') expr = expr.slice(0,-1), updateDisplay(expr||'0');
  if (key === 'c' || key === 'C') clearAll();
  if (key === 'a' || key === 'A'){
    showDeveloper();
  }
  if (key === 'b' || key === 'B'){
    showApplication();
  }
});

// Modal functions
function showModal(title, html){
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modalOverlay.classList.add('show');
  modalOverlay.setAttribute('aria-hidden', 'false');
}

function hideModal(){
  modalOverlay.classList.remove('show');
  modalOverlay.setAttribute('aria-hidden', 'true');
}

function showDeveloper(){
  const html = `
    <p>Name: Joemari B. Ampuan</p>
    <p>GitHub: <a href="https://github.com/joemariampuan18-blip" target="_blank" rel="noopener">https://github.com/joemariampuan18-blip</a></p>
  `;
  showModal('Developer', html);
}

function showApplication(){
  const html = `
    <p>Standard Calculator - web version</p>
    <p>Version: 1.0</p>
  `;
  showModal('Application', html);
}

// modal close handlers
modalClose.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', (e)=>{ if (e.target===modalOverlay) hideModal(); });

// initial
updateDisplay('0');











































































































// End of file
