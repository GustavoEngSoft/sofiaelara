document.addEventListener('DOMContentLoaded', ()=>{
  // Config
  const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyB0QMkbNotHwI5FTU0SSu3f23hrY_rZXWs',
    authDomain: 'sofiaelara-6fff1.firebaseapp.com',
    projectId: 'sofiaelara-6fff1',
    storageBucket: 'sofiaelara-6fff1.firebasestorage.app',
    messagingSenderId: '606942974547',
    appId: '1:606942974547:web:d27faa84464d2c84ebaca6',
    measurementId: 'G-KYD60L821L',
  };
  const FIREBASE_COUNTER_DOC = 'site/config';
  const PIX_KEY = 'seuemail@email.com';
  const STORAGE_PRAYED = 'site_prayed_v1';

  // Elements
  const prayBtn = document.getElementById('pray-button');
  const prayCountEl = document.getElementById('pray-count');
  const pixKeyEl = document.getElementById('pix-key');
  const whatsappFab = document.getElementById('whatsapp-fab');
  const backgroundMusic = document.getElementById('background-music');

  const hasFirebaseConfig = Object.values(FIREBASE_CONFIG).every(value => value && value.trim());
  let firebaseDb = null;
  let firebaseDocRef = null;

  function setCountValue(value){
    prayCountEl.textContent = Number(value || 0).toLocaleString('pt-BR');
  }

  let count = 0;
  setCountValue(count);

  if(hasFirebaseConfig && window.firebase && !firebase.apps.length){
    firebase.initializeApp(FIREBASE_CONFIG);
    firebaseDb = firebase.firestore();
    firebaseDocRef = firebaseDb.doc(FIREBASE_COUNTER_DOC);
  }

  // Disable if already prayed on this device
  if(localStorage.getItem(STORAGE_PRAYED)){
    prayBtn.disabled = true;
    prayBtn.textContent = 'Intercessão registrada';
  }

  async function loadPrayerCount(){
    if(firebaseDocRef){
      try{
        const snapshot = await firebaseDocRef.get();
        if(snapshot.exists){
          const data = snapshot.data();
          if(typeof data.count === 'number'){
            count = data.count;
            setCountValue(count);
            return;
          }
        }
        await firebaseDocRef.set({count: 0}, {merge:true});
        count = 0;
        setCountValue(count);
      }catch(e){
        console.warn('Firebase indisponível, usando contador local.', e);
      }
    }
    setCountValue(count);
  }

  async function incrementPrayerCount(){
    if(firebaseDocRef){
      try{
        await firebaseDb.runTransaction(async (transaction)=>{
          const snapshot = await transaction.get(firebaseDocRef);
          const currentCount = snapshot.exists && typeof snapshot.data().count === 'number'
            ? snapshot.data().count
            : count;
          const nextCount = currentCount + 1;
          transaction.set(firebaseDocRef, {count: nextCount}, {merge:true});
          count = nextCount;
        });
        setCountValue(count);
        return;
      }catch(e){
        console.warn('Falha ao atualizar o contador no Firebase, mantendo fallback local.', e);
      }
    }

    count = count + 1;
    setCountValue(count);
  }

  loadPrayerCount();

  prayBtn.addEventListener('click', async ()=>{
    if(prayBtn.disabled) return;
    prayBtn.disabled = true;
    // optimistic UI
    await incrementPrayerCount();
    prayBtn.textContent = 'Obrigado por interceder';
    localStorage.setItem(STORAGE_PRAYED, '1');

  });

  if(pixKeyEl){
    pixKeyEl.textContent = PIX_KEY;
  }

  if(whatsappFab){
    const whatsappParts = ['67', '9910', '17841'];
    const whatsappNumber = whatsappParts.join('');
    whatsappFab.href = `https://wa.me/55${whatsappNumber}`;
  }

  if(backgroundMusic){
    const tryPlayMusic = async ()=>{
      try{
        backgroundMusic.volume = 0.55;
        await backgroundMusic.play();
        document.removeEventListener('pointerdown', tryPlayMusic);
        document.removeEventListener('touchstart', tryPlayMusic);
        document.removeEventListener('keydown', tryPlayMusic);
      }catch(e){
        console.warn('Autoplay bloqueado pelo navegador; a trilha será iniciada no primeiro toque.', e);
      }
    };

    backgroundMusic.addEventListener('canplay', tryPlayMusic, {once:true});
    backgroundMusic.addEventListener('loadedmetadata', tryPlayMusic, {once:true});
    document.addEventListener('pointerdown', tryPlayMusic, {once:true});
    document.addEventListener('touchstart', tryPlayMusic, {once:true});
    document.addEventListener('keydown', tryPlayMusic, {once:true});
  }

  // Lightbox gallery
  const thumbs = document.querySelectorAll('.thumb');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  if(lightbox && lbImg && lbClose){
    thumbs.forEach(t=>{
      t.addEventListener('click', ()=>{
        lbImg.src = t.src;
        lightbox.setAttribute('aria-hidden','false');
      });
    });
    lbClose.addEventListener('click', ()=>{ lightbox.setAttribute('aria-hidden','true'); lbImg.src = ''; });
  }

  // Testimonials carousel
  // Testimonials (store in localStorage)
  const TESTI_KEY = 'site_testimonials_v1';
  const testiList = document.getElementById('testimonials-list');
  const testiForm = document.getElementById('testi-form');
  const testiName = document.getElementById('testi-name');
  const testiMessage = document.getElementById('testi-message');

  function loadTestimonials(){
    const raw = localStorage.getItem(TESTI_KEY);
    const defaults = [
      {name:'Papai e Mamãe', msg:'Ver Sofia e Lara respondendo ao chamado com sensibilidade e coragem é motivo de alegria e gratidão. Que Deus continue conduzindo cada passo dessa jornada.'},
      {name:'Amigos e irmãos', msg:'A vida delas inspira fé prática, serviço e amor ao próximo. Oramos para que essa estação seja marcada por crescimento e frutificação.'}
    ];
    if(!raw) return defaults;
    try{
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : defaults;
    }catch(e){
      return defaults;
    }
  }
  function saveTestimonials(arr){ localStorage.setItem(TESTI_KEY, JSON.stringify(arr)); }
  function renderTestimonials(){
    if(!testiList) return;
    testiList.innerHTML = '';
    const arr = loadTestimonials();
    arr.slice().reverse().forEach(t=>{
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `<p>“${escapeHtml(t.msg)}”</p><p class="author">— ${escapeHtml(t.name)}</p>`;
      testiList.appendChild(card);
    });
  }
  function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  renderTestimonials();

  if(testiForm && testiName && testiMessage){
    testiForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = testiName.value.trim();
      const msg = testiMessage.value.trim();
      if(!name || !msg) return;
      const arr = loadTestimonials();
      arr.push({name:name,msg:msg});
      saveTestimonials(arr);
      testiName.value=''; testiMessage.value='';
      renderTestimonials();
    });
  }

  // smooth scroll from hero button to story
  const btnStory = document.getElementById('btn-story');
  if(btnStory){ btnStory.addEventListener('click', ()=>{ document.getElementById('story').scrollIntoView({behavior:'smooth'}); }); }

});
