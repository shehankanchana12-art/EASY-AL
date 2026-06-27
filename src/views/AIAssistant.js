import { syllabus } from "../data/syllabus.js";

// Keep track of active quiz
let activeQuiz = null;

export function renderAIAssistant(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 90%; max-width: 800px; margin: 0 auto;">
      <div class="glass-panel" id="chat-box" style="flex: 1; overflow-y: auto; padding: 24px; margin-bottom: 16px; border-radius: 16px; min-height: 400px; display: flex; flex-direction: column; gap: 16px;">
        <div class="ai-message" style="background: var(--bg-secondary); padding: 12px 16px; border-radius: 12px; max-width: 80%; align-self: flex-start; line-height: 1.5;">
          👋 Hello! I am your **Zephyros Study AI**. I am trained on the Sri Lankan A/L syllabus.<br/><br/>
          You can ask me to:
          <ul>
            <li><strong>"Give me a quiz"</strong> to test your knowledge</li>
            <li><strong>"Show syllabus for Physics"</strong> (or Chemistry, Biology, Mathematics)</li>
            <li><strong>"Recommend a study topic"</strong> based on estimated hours</li>
          </ul>
        </div>
      </div>
      <div class="glass-panel" style="display: flex; gap: 12px; padding: 12px; border-radius: 16px;">
        <input type="text" id="chat-input" class="auth-input" style="margin: 0; flex: 1; border-radius: 8px;" placeholder="Ask me anything about your syllabus or type 'quiz'..." />
        <button id="chat-send" class="btn-primary" style="border-radius: 8px; cursor: pointer; padding: 0 20px;">Send</button>
      </div>
    </div>
  `;

  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("chat-input");

  function appendMessage(sender, text, isHtml = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-message" : "ai-message";
    
    // Style messages
    if (sender === "user") {
      msgDiv.style.alignSelf = "flex-end";
      msgDiv.style.background = "var(--primary-color, #007AFF)";
      msgDiv.style.color = "#FFF";
    } else {
      msgDiv.style.alignSelf = "flex-start";
      msgDiv.style.background = "var(--bg-tertiary)";
      msgDiv.style.color = "var(--text-primary)";
    }
    
    msgDiv.style.padding = "12px 16px";
    msgDiv.style.borderRadius = "12px";
    msgDiv.style.maxWidth = "80%";
    msgDiv.style.lineHeight = "1.5";
    msgDiv.style.wordBreak = "break-word";

    if (isHtml) {
      msgDiv.innerHTML = text;
    } else {
      msgDiv.textContent = text;
    }
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Handle active quiz answers
  function handleQuizAnswer(userText) {
    if (!activeQuiz) return false;

    const answer = userText.trim().toLowerCase();
    const correctLetter = activeQuiz.correctAnswer.toLowerCase();
    const isCorrect = answer === correctLetter || answer.includes(activeQuiz.correctChoiceText.toLowerCase());

    if (isCorrect) {
      appendMessage("ai", `🎉 **Correct!** Outstanding job. You got it right! Let me know when you're ready for another quiz.`, true);
    } else {
      appendMessage("ai", `❌ **Incorrect.** The correct answer was **${activeQuiz.correctAnswer}**: *${activeQuiz.correctChoiceText}*.<br/><br/>*Tip: Review ${activeQuiz.unitName} to reinforce this concept.*`, true);
    }

    activeQuiz = null;
    return true;
  }

  // Generate a random quiz question based on syllabus
  function generateQuiz() {
    const subjects = Object.keys(syllabus);
    const randomSubjectKey = subjects[Math.floor(Math.random() * subjects.length)];
    const subject = syllabus[randomSubjectKey];
    const unit = subject.units[Math.floor(Math.random() * subject.units.length)];
    
    // Mock questions repository
    const questions = [
      {
        q: `For **${subject.name} - ${unit.name}**, which topic is most fundamental?`,
        choices: [unit.topics[0] || "General Concepts", "None of the above", "All of the above"],
        correctIndex: 0
      },
      {
        q: `In **${subject.name}**, the estimated study time for **${unit.name}** is:`,
        choices: [`${unit.estHours} hours`, `${unit.estHours + 5} hours`, `${unit.estHours - 2} hours`, "Undetermined"],
        correctIndex: 0
      },
      {
        q: `What is the estimated difficulty rating of **${unit.name}**?`,
        choices: ["Easy", "Medium", "Hard", "Varies per student"],
        correctIndex: unit.difficulty === "Easy" ? 0 : unit.difficulty === "Medium" ? 1 : 2
      }
    ];

    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    // Format choices
    const letters = ["A", "B", "C", "D"];
    const choiceTexts = selectedQuestion.choices.map((c, i) => `<strong>${letters[i]}</strong>) ${c}`).join("<br/>");

    activeQuiz = {
      correctAnswer: letters[selectedQuestion.correctIndex],
      correctChoiceText: selectedQuestion.choices[selectedQuestion.correctIndex],
      unitName: unit.name
    };

    appendMessage("ai", `📝 **Quiz Time!** here is a question:<br/><br/>${selectedQuestion.q}<br/><br/>${choiceTexts}<br/><br/>*Reply with the letter (A, B, C, or D) of your answer!*`, true);
  }

  function handleSend() {
    const txt = input.value.trim();
    if (!txt) return;

    appendMessage("user", txt);
    input.value = "";

    setTimeout(() => {
      // 1. Check if we're in the middle of a quiz
      if (activeQuiz) {
        const handled = handleQuizAnswer(txt);
        if (handled) return;
      }

      const lowerTxt = txt.toLowerCase();

      // 2. Quiz trigger
      if (lowerTxt.includes("quiz") || lowerTxt.includes("test") || lowerTxt.includes("question")) {
        generateQuiz();
        return;
      }

      // 3. Subject-specific queries
      let matchedSubject = null;
      if (lowerTxt.includes("physics")) matchedSubject = syllabus.Physics;
      else if (lowerTxt.includes("chemistry")) matchedSubject = syllabus.Chemistry;
      else if (lowerTxt.includes("biology")) matchedSubject = syllabus.Biology;
      else if (lowerTxt.includes("math")) matchedSubject = syllabus.CombinedMaths;

      if (matchedSubject) {
        const listHtml = matchedSubject.units.slice(0, 5).map(u => `<li><strong>${u.name}</strong> (Difficulty: ${u.difficulty}, Est. Hours: ${u.estHours}h)</li>`).join("");
        appendMessage("ai", `📚 Here are some of the units in the **${matchedSubject.name}** syllabus:<br/><br/><ul>${listHtml}</ul><br/>*Type 'quiz' to test yourself on this subject!*`, true);
        return;
      }

      // 4. Recommendation trigger
      if (lowerTxt.includes("recommend") || lowerTxt.includes("study") || lowerTxt.includes("suggest")) {
        const subjects = Object.keys(syllabus);
        const randomSub = syllabus[subjects[Math.floor(Math.random() * subjects.length)]];
        const randomUnit = randomSub.units[Math.floor(Math.random() * randomSub.units.length)];
        appendMessage("ai", `✨ **Study Suggestion:**<br/>I recommend starting or reviewing **${randomSub.name} - ${randomUnit.name}**.<br/><br/>* - Difficulty:* ${randomUnit.difficulty}<br/>* - Estimated Hours:* ${randomUnit.estHours}h<br/>* - Recommended topics to cover:* ${randomUnit.topics.join(", ")}`, true);
        return;
      }

      // 5. Default responder
      appendMessage("ai", `💭 I processed your message, but I'm best at handling syllabus and quiz queries. Try asking:<br/><br/>- *"Show me Physics"*<br/>- *"Give me a quiz"*<br/>- *"Recommend a study topic"*`, true);
    }, 800);
  }

  // Listeners
  document.getElementById("chat-send").addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });
}
