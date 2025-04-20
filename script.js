let quizData = JSON.parse(localStorage.getItem("quizData") || "[]");
if (quizData.length === 0) {
    alert("No questions found! Please add questions from the admin panel.");
  }
  // Shuffle utility
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  shuffle(quizData);
  
  let currentQ = 0;
  let score = 0;
  let selected = null;
  let timerInterval;
  let timeLeft = 10;
  
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const feedbackEl = document.getElementById('feedback');
  const submitBtn = document.getElementById('submit-btn');
  const progressEl = document.getElementById('progress');
  const scoreBoard = document.getElementById('score-board');
  
  // Load and show the current question
  function loadQuestion() {
    resetTimer();
    feedbackEl.textContent = "";
  
    const q = quizData[currentQ];
    shuffle(q.options);
    q.correctIndex = q.options.findIndex(opt => opt === q.answer);
  
    questionEl.textContent = `Q${currentQ + 1}. ${q.question}`;
    optionsEl.innerHTML = "";
  
    q.options.forEach((opt, idx) => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.setAttribute('data-index', idx);
      li.addEventListener('click', () => {
        document.querySelectorAll('#options li').forEach(li => li.classList.remove('selected'));
        li.classList.add('selected');
        selected = idx;
      });
      optionsEl.appendChild(li);
    });
  
    progressEl.style.width = ((currentQ / quizData.length) * 100) + '%';
    startTimer();
  }
  
  // Timer functions
  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    submitBtn.textContent = `Submit (${timeLeft}s)`;
  }
  
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      submitBtn.textContent = `Submit (${timeLeft}s)`;
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        handleSubmit(true); // auto-submit
      }
    }, 1000);
  }
  
  // Submission
  submitBtn.addEventListener('click', () => handleSubmit());
  
  function handleSubmit(autoSubmit = false) {
    clearInterval(timerInterval);
    if (selected === null && !autoSubmit) return alert("Please select an option!");
  
    const current = quizData[currentQ];
    const correctIndex = current.correctIndex;
    const isCorrect = selected === correctIndex;
  
    feedbackEl.textContent = isCorrect ? "✅ Correct!" : `❌ Wrong! Correct: ${current.options[correctIndex]}`;
    if (isCorrect) score++;
  
    currentQ++;
    selected = null;
  
    if (currentQ < quizData.length) {
      setTimeout(loadQuestion, 1500);
    } else {
      showResult();
    }
  }
  
  // Result screen
  function showResult() {
    questionEl.textContent = "🎉 Quiz Completed!";
    optionsEl.innerHTML = "";
    submitBtn.style.display = "none";
    feedbackEl.textContent = "";
  
    scoreBoard.innerHTML = `
      <h3>Your Score: ${score}/${quizData.length}</h3>
      <button onclick="restartQuiz()">🔁 Retake Quiz</button>
      <button onclick="shareResult()">📤 Share Result</button>
    `;
  
    progressEl.style.width = "100%";
  }
  
  // Restart
  function restartQuiz() {
    currentQ = 0;
    score = 0;
    selected = null;
    submitBtn.style.display = "block";
    scoreBoard.innerHTML = "";
    shuffle(quizData);
    quizData.forEach(q => shuffle(q.options));
    loadQuestion();
  }
  
  // Share score
  function shareResult() {
    const msg = `🎓 I scored ${score}/${quizData.length} on the MAIT Quiz! Try it yourself!`;
    if (navigator.share) {
      navigator.share({ title: "MAIT Quiz Result", text: msg });
    } else {
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(whatsappURL, '_blank');
    }
  }
  
  loadQuestion();
  