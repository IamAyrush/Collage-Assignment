const ADMIN_PASSWORD = "admin123";

    function authenticate() {
      const input = document.getElementById('admin-password').value;
      if (input === ADMIN_PASSWORD) {
        document.getElementById('login-screen').style.display = "none";
        document.getElementById('admin-panel').style.display = "block";
        loadQuestions();
      } else {
        alert("Incorrect password!");
      }
    }

    function loadQuestions() {
      const container = document.getElementById('question-list');
      const questions = JSON.parse(localStorage.getItem("quizData") || "[]");
      container.innerHTML = "";

      questions.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "question-block";
        div.innerHTML = `
          <h3>${q.question}</h3>
          <ul>${q.options.map((opt, idx) => `<li>${idx + 1}. ${opt} ${q.answer === opt ? '✅' : ''}</li>`).join('')}</ul>
          <div class="actions">
            <button onclick="deleteQuestion(${i})">❌ Delete</button>
          </div>
        `;
        container.appendChild(div);
      });
    }

    function addQuestion() {
      const q = document.getElementById("new-question").value;
      const opts = [
        document.getElementById("new-option1").value,
        document.getElementById("new-option2").value,
        document.getElementById("new-option3").value,
        document.getElementById("new-option4").value
      ];
      const correctIdx = parseInt(document.getElementById("new-answer").value);

      if (!q || opts.some(opt => !opt)) {
        alert("Please fill all fields");
        return;
      }

      const newQ = {
        question: q,
        options: opts,
        answer: opts[correctIdx]
      };

      const questions = JSON.parse(localStorage.getItem("quizData") || "[]");
      questions.push(newQ);
      localStorage.setItem("quizData", JSON.stringify(questions));

      alert("Question added!");
      loadQuestions();
      document.querySelectorAll("input").forEach(inp => inp.value = "");
    }

    function deleteQuestion(index) {
      const questions = JSON.parse(localStorage.getItem("quizData") || "[]");
      questions.splice(index, 1);
      localStorage.setItem("quizData", JSON.stringify(questions));
      loadQuestions();
    }