/* script.js - lógica do quiz */
(() => {
  // ====== CONFIGURAÇÃO INICIAL ======
  const QUESTIONS = [
    // Antigo Testamento (ot)
    { id: 1, cat: 'ot', q: 'Quem liderou os israelitas na saída do Egito?', choices: ['Moisés','Davi','Abraão','Samuel'], a: 0, explain: 'Moisés conduziu o êxodo do Egito (Êxodo).' },
    { id: 2, cat: 'ot', q: 'Qual foi a cidade destruída por fogo devido ao pecado?', choices: ['Nínive','Jerusalém','Sodoma','Babilônia'], a: 2, explain: 'Sodoma foi destruída por fogo e enxofre (Gênesis).' },
    { id: 3, cat: 'ot', q: 'Quem escreveu muitos dos provérbios?', choices: ['Salomão','Elias','Isaque','Jacó'], a: 0, explain: 'Salomão é tradicionalmente associado aos Provérbios.' },

    // Novo Testamento (nt)
    { id: 11, cat: 'nt', q: 'Qual apóstolo negou Jesus três vezes?', choices: ['Pedro','Paulo','João','Tomé'], a: 0, explain: 'Pedro negou Jesus três vezes antes do galo cantar.' },
    { id: 12, cat: 'nt', q: 'Quem batizou Jesus no rio Jordão?', choices: ['João Batista','Pedro','Paulo','Tiago'], a: 0, explain: 'João Batista batizou Jesus no Jordão.' },
    { id: 13, cat: 'nt', q: 'Em qual livro está o Sermão da Montanha?', choices: ['Marcos','Lucas','Mateus','João'], a: 2, explain: 'O Sermão da Montanha encontra-se em Mateus capítulos 5–7.' },

    // misto/exemplos adicionais
    { id: 21, cat: 'ot', q: 'Qual homem foi lançado na cova dos leões e sobreviveu?', choices: ['Daniel','Ezequiel','Isaías','Jeremias'], a: 0, explain: 'Daniel sobreviveu na cova dos leões (Livro de Daniel).' },
    { id: 22, cat: 'nt', q: 'Quem escreveu muitas cartas às igrejas primitiva (epístolas)?', choices: ['Paulo','Pedro','Mateus','Lucas'], a: 0, explain: 'Paulo escreveu várias epístolas (cartas) no Novo Testamento.' }
  ];

  // UI elements
  const $ = sel => document.querySelector(sel);
  const startBtn = $('#startBtn');
  const categorySel = $('#category');
  const numQInput = $('#numQ');
  const timerInput = $('#timer');
  const setupSection = $('#setup');
  const quizSection = $('#quiz');
  const resultSection = $('#result');
  const questionText = $('#questionText');
  const choicesBox = $('#choices');
  const currentEl = $('#current');
  const totalEl = $('#total');
  const scoreEl = $('#score');
  const progressBar = $('#progress-bar');
  const nextBtn = $('#nextBtn');
  const explanationEl = $('#explanation');
  const metaCategory = $('#meta-category');
  const timerDisplay = $('#timerDisplay');
  const timerCountEl = $('#timerCount');
  const finalScoreEl = $('#finalScore');
  const resultMsg = $('#resultMsg');
  const retryBtn = $('#retryBtn');
  const backBtn = $('#backBtn');

  // State
  let shuffled = [];
  let currentIndex = 0;
  let score = 0;
  let selected = null;
  let questionTimer = null;
  let remaining = 0;
  let perQuestionTime = 0;

  // Helpers
  function shuffle(a){
    return a.slice().sort(() => Math.random() - 0.5);
  }

  function formatCategory(val){
    if(val === 'ot') return 'Antigo Testamento';
    if(val === 'nt') return 'Novo Testamento';
    return 'Ambas';
  }

  // ====== INICIAR QUIZ ======
  startBtn.addEventListener('click', () => {
    const cat = categorySel.value;
    const requested = Math.max(1, Math.min(20, parseInt(numQInput.value) || 10));
    perQuestionTime = Math.max(0, parseInt(timerInput.value) || 0);

    // Filtrar perguntas
    let pool = QUESTIONS.filter(q => cat === 'all' ? true : q.cat === cat);
    if(pool.length === 0){
      alert('Não existem perguntas na categoria selecionada.');
      return;
    }

    // Embaralhar e cortar
    shuffled = shuffle(pool).slice(0, Math.min(requested, pool.length));
    currentIndex = 0;
    score = 0;
    selected = null;

    // Atualizar UI
    setupSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    resultSection.classList.add('hidden');

    $('#total').textContent = shuffled.length;
    $('#meta-category').textContent = formatCategory(cat);
    scoreEl.textContent = score;
    renderQuestion();
  });

  // ====== RENDERIZAÇÃO DE PERGUNTA ======
  function renderQuestion(){
    clearTimer();
    selected = null;
    nextBtn.disabled = true;
    explanationEl.classList.add('hidden');
    explanationEl.textContent = '';

    const q = shuffled[currentIndex];
    currentEl.textContent = currentIndex + 1;
    questionText.textContent = q.q;

    // choices
    choicesBox.innerHTML = '';
    q.choices.forEach((c, i) => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.type = 'button';
      button.setAttribute('data-index', i);
      button.innerHTML = `<span class="lbl">${c}</span>`;
      button.addEventListener('click', onChoice);
      choicesBox.appendChild(button);
    });

    updateProgress();
    // start per-question timer
    if(perQuestionTime > 0){
      remaining = perQuestionTime;
      timerDisplay.hidden = false;
      timerCountEl.textContent = remaining;
      questionTimer = setInterval(() => {
        remaining -= 1;
        timerCountEl.textContent = remaining;
        if(remaining <= 0){
          clearTimer();
          handleTimeout();
        }
      }, 1000);
    } else {
      timerDisplay.hidden = true;
    }
  }

  function updateProgress(){
    const pct = Math.round(((currentIndex) / shuffled.length) * 100);
    progressBar.style.width = pct + '%';
  }

  // ====== ESCOLHA DO USUÁRIO ======
  function onChoice(e){
    const idx = Number(e.currentTarget.getAttribute('data-index'));
    const q = shuffled[currentIndex];

    // bloquear escolhas adicionais
    Array.from(choicesBox.children).forEach(btn => btn.disabled = true);

    // marcar escolhas
    if(idx === q.a){
      e.currentTarget.classList.add('correct');
      score += 1;
      scoreEl.textContent = score;
    } else {
      e.currentTarget.classList.add('wrong');
      // indicar a resposta correta visualmente
      const correctBtn = choicesBox.querySelector(`[data-index="${q.a}"]`);
      if(correctBtn) correctBtn.classList.add('correct');
    }

    // mostrar explicação
    explanationEl.textContent = q.explain || '';
    explanationEl.classList.remove('hidden');

    // permitir avançar
    nextBtn.disabled = false;
    clearTimer();
  }

  // ====== QUANDO O TEMPO ACABA ======
  function handleTimeout(){
    // desabilita todas as choices
    Array.from(choicesBox.children).forEach(btn => btn.disabled = true);
    // marca a resposta correta
    const q = shuffled[currentIndex];
    const correctBtn = choicesBox.querySelector(`[data-index="${q.a}"]`);
    if(correctBtn) correctBtn.classList.add('correct');
    explanationEl.textContent = 'Tempo esgotado. ' + (q.explain || '');
    explanationEl.classList.remove('hidden');
    nextBtn.disabled = false;
  }

  function clearTimer(){
    if(questionTimer) {
      clearInterval(questionTimer);
      questionTimer = null;
    }
  }

  // ====== BOTÃO PRÓXIMA ======
  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if(currentIndex >= shuffled.length){
      showResult();
    } else {
      renderQuestion();
    }
  });

  // ====== RESULTADO ======
  function showResult(){
    clearTimer();
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    finalScoreEl.textContent = score;
    const total = shuffled.length;
    const pct = Math.round((score / total) * 100);

    if(pct >= 80) resultMsg.textContent = `Excelente! ${pct}% de acertos. Parabéns!`;
    else if(pct >= 50) resultMsg.textContent = `Bom trabalho — ${pct}% de acertos. Continua a estudar.`;
    else resultMsg.textContent = `Continua praticando — ${pct}% de acertos. Estuda mais as Escrituras.`;
  }

  retryBtn.addEventListener('click', () => {
    // reiniciar mesmo conjunto de perguntas
    currentIndex = 0;
    score = 0;
    scoreEl.textContent = 0;
    $('#score').textContent = score;
    $('#finalScore').textContent = 0;
    resultSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    renderQuestion();
  });

  backBtn.addEventListener('click', () => {
    // voltar ao setup
    clearTimer();
    resultSection.classList.add('hidden');
    quizSection.classList.add('hidden');
    setupSection.classList.remove('hidden');
  });

  // acessibilidade: start with Enter on startBtn
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !quizSection.classList.contains('hidden') && !nextBtn.disabled){
      nextBtn.click();
    }
  });

  // end of module
})();