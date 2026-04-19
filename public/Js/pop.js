 (function(){

    document.addEventListener('DOMContentLoaded', function() {
  // Tab elements
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const panelLogin = document.getElementById('panel-login');
  const panelSignup = document.getElementById('panel-signup');
  const gotoSignUp = document.getElementById('gotoSignUp');
  const gotoLogin = document.getElementById('gotoLogin');

  // Tab switching
  if (tabLogin && tabSignup && panelLogin && panelSignup) {
    tabLogin.addEventListener('click', function() {
      tabLogin.setAttribute('aria-selected', 'true');
      tabSignup.setAttribute('aria-selected', 'false');
      panelLogin.hidden = false;
      panelSignup.hidden = true;
    });

    tabSignup.addEventListener('click', function() {
      tabLogin.setAttribute('aria-selected', 'false');
      tabSignup.setAttribute('aria-selected', 'true');
      panelLogin.hidden = true;
      panelSignup.hidden = false;
    });
  }

  // Link switching
  if (gotoSignUp) {
    gotoSignUp.addEventListener('click', function(e) {
      e.preventDefault();
      tabSignup.click();
    });
  }
  if (gotoLogin) {
    gotoLogin.addEventListener('click', function(e) {
      e.preventDefault();
      tabLogin.click();
    });
  }
});

  const backdrop = document.getElementById('authModalBackdrop');
  const panel = document.getElementById('authPanel');
  const openBtn = document.getElementById('openAuth');
  const closeBtn = document.getElementById('closeAuth');
  const tabLogin = document.getElementById('tab-login');
  const tabSign = document.getElementById('tab-signup');
  const panelLogin = document.getElementById('panel-login');
  const panelSign = document.getElementById('panel-signup');
  const panelForgot = document.getElementById('panel-forgot');
  const gotoSignUp = document.getElementById('gotoSignUp');
  const gotoLogin = document.getElementById('gotoLogin');
  const openForgot = document.getElementById('openForgot');
  const backToLogin = document.getElementById('backToLogin');
  const topToast = document.getElementById('topToast');
  const globalToastEl = document.getElementById('globalToast');
  const globalToastBody = document.getElementById('globalToastBody');
  const bsGlobalToast = new bootstrap.Toast(globalToastEl, { delay: 3000 });
  const FOCUSABLE = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

  document.addEventListener('DOMContentLoaded', function() {
  const homeLoginBtn = document.getElementById('homeLoginBtn');
  const authModalBackdrop = document.getElementById('authModalBackdrop');

  function showAuthModal() {
    authModalBackdrop.classList.remove('mb-hidden');
    authModalBackdrop.setAttribute('aria-hidden', 'false');
  }

  if (homeLoginBtn) {
    homeLoginBtn.addEventListener('click', showAuthModal);
  }
});


  function showTopToast(message){
    topToast.textContent = message;
    topToast.classList.add('show');
    setTimeout(()=> topToast.classList.remove('show'), 2800);
  }


  // openBtn.addEventListener('click', ()=> showAuth('login')); // This button doesn't exist in HTML
  if (closeBtn) {
    closeBtn.addEventListener('click', hideAuth);
  }
  if (backdrop) {
    backdrop.addEventListener('click', (e)=> { if(e.target === backdrop) hideAuth(); });
  }

  function showAuth(tab='login'){
    backdrop.classList.remove('mb-hidden'); 
    backdrop.classList.add('mb-show'); 
    backdrop.removeAttribute('aria-hidden');
    switch(tab){
      case 'signup': activateTab(tabSign); break;
      case 'forgot': showForgot(); break;
      default: activateTab(tabLogin);
    }
    setTimeout(()=> panel.focus(), 220);
    trapFocus(panel);
    document.body.style.overflow = 'hidden';
  }

  function hideAuth(){
    backdrop.classList.remove('mb-show'); 
    backdrop.classList.add('mb-hidden'); 
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocusTrap();
  }


  function activateTab(tabEl){
    tabLogin.setAttribute('aria-selected', 'false'); tabLogin.setAttribute('tabindex','-1');
    tabSign.setAttribute('aria-selected', 'false'); tabSign.setAttribute('tabindex','-1');
    tabEl.setAttribute('aria-selected', 'true'); tabEl.setAttribute('tabindex','0');
    [panelLogin, panelSign, panelForgot].forEach(p => { p.hidden = true; p.classList.remove('shake') });
    if(tabEl === tabLogin) { panelLogin.hidden = false; panelLogin.classList.add('fade-in'); }
    else if(tabEl === tabSign) { panelSign.hidden = false; panelSign.classList.add('fade-in'); }
  }

  tabLogin.addEventListener('click', ()=> activateTab(tabLogin));
  tabSign.addEventListener('click', ()=> activateTab(tabSign));
  gotoSignUp.addEventListener('click', (e)=> { e.preventDefault(); activateTab(tabSign); });
  gotoLogin.addEventListener('click', (e)=> { e.preventDefault(); activateTab(tabLogin); });


  function showForgot(){
    tabLogin.setAttribute('aria-selected', 'false'); 
    tabSign.setAttribute('aria-selected', 'false');
    panelLogin.hidden = true; panelSign.hidden = true; panelForgot.hidden = false;
  }
  openForgot.addEventListener('click', (e)=> { e.preventDefault(); showForgot(); });
  backToLogin.addEventListener('click', (e)=> { e.preventDefault(); activateTab(tabLogin); });

  function wirePwdToggle(toggleId, inputId){
    const t = document.getElementById(toggleId);
    const inp = document.getElementById(inputId);
    if(!t || !inp) return;
    function toggle(){
      const isPwd = inp.type === 'password';
      inp.type = isPwd ? 'text' : 'password';
      t.innerHTML = isPwd ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    }
    t.addEventListener('click', toggle);
    t.addEventListener('keydown', (ev)=> { if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); toggle(); }});
  }
  wirePwdToggle('loginPwdToggle','loginPassword');
  wirePwdToggle('suPwdToggle','suPwd');

  const wrapper=document.querySelector('.products-wrapper');
  document.querySelector('.scroll-left').addEventListener('click',()=>wrapper.scrollBy({left:-250,behavior:'smooth'}));
  document.querySelector('.scroll-right').addEventListener('click',()=>wrapper.scrollBy({left:250,behavior:'smooth'}));
  const items=document.querySelectorAll('.timeline li');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');}});
  },{threshold:.2});
  items.forEach(i=>obs.observe(i));
})();

