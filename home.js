// ===== Mobile Menu Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('active');
    }
  });
}

// ===== Scroll Reveal Animations =====
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => observer.observe(el));

// ===== Page Loader =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.opacity = '0';
  setTimeout(() => {
    loader.style.display = 'none';
  }, 600);
});

// ===== AI Assistant Logic =====

// Basic knowledge base about you
const knowledge = [
  {
    keywords: ['skill', 'skills', 'stack', 'technologies', 'tech'],
    answer:
      "Dave’s core skills include front-end web development (HTML, CSS, JavaScript), responsive design, basic cybersecurity concepts, youth development programming, and music ministry leadership."
  },
  {
    keywords: ['project', 'projects', 'portfolio', 'work'],
    answer:
      "Dave has worked on portfolio websites, youth-focused initiatives, and creative projects that combine web development, leadership, and music. You can explore them on the Projects page."
  },
  {
    keywords: ['location', 'based', 'where', 'country'],
    answer:
      "Dave is based in Monrovia, Liberia, and is open to both local and remote opportunities."
  },
  {
    keywords: ['collaborate', 'work together', 'hire', 'contact'],
    answer:
      "To collaborate or hire Dave, please use the Contact page to share your project details, timeline, and expectations. He’ll respond as soon as possible."
  },
  {
    keywords: ['background', 'about', 'experience'],
    answer:
      "Dave has a diverse background as a youth practitioner, web developer, music minister, and cybersecurity enthusiast, with a passion for impact-driven work."
  }
];

// Helper to create chat bubbles
function addMessage(text, sender = 'bot') {
  const chatBody = document.getElementById('chat-body');
  if (!chatBody) return;
  const msg = document.createElement('div');
  msg.classList.add('chat-message', sender);
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Simple matching logic for user questions
function getAnswer(question) {
  const q = question.toLowerCase();

  // Check knowledge base
  for (const item of knowledge) {
    if (item.keywords.some((k) => q.includes(k))) {
      return item.answer;
    }
  }

  // Some extra patterns
  if (q.includes('who are you') || q.includes('who is dave')) {
    return "I’m Dave’s assistant. Dave is a web developer, youth practitioner, music minister, and cybersecurity enthusiast from Liberia.";
  }

  if (q.includes('music')) {
    return "Dave serves as a music minister and worship leader, using music to inspire faith, connection, and transformation.";
  }

  if (q.includes('cyber')) {
    return "Dave is a cybersecurity enthusiast focused on learning about network security, ethical hacking, and digital safety.";
  }

  // Default
  return "That’s a great question! Dave focuses on youth development, web development, music ministry, and cybersecurity. For specific details, you can ask about his skills, projects, or how to work with him.";
}

// ===== Chat UI =====
const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const suggestionButtons = document.querySelectorAll('.chat-suggestion');

if (chatToggle && chatWidget) {
  chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('open');
  });
}

if (chatClose && chatWidget) {
  chatClose.addEventListener('click', () => {
    chatWidget.classList.remove('open');
  });
}

// Send message handler
function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';

  const reply = getAnswer(text);
  addMessage(reply, 'bot');
  speak(reply);
}

if (chatSend) {
  chatSend.addEventListener('click', handleSend);
}

if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });
}

// Suggestions click
suggestionButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const text = btn.textContent;
    addMessage(text, 'user');
    const reply = getAnswer(text);
    addMessage(reply, 'bot');
    speak(reply);
  });
});

// ===== Voice: Speech-to-Text & Text-to-Speech =====
const voiceBtn = document.getElementById('voice-btn');
let recognition = null;
let isRecording = false;

// Speech recognition (Chrome / Edge support)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    handleSend();
  });

  recognition.addEventListener('end', () => {
    isRecording = false;
    if (voiceBtn) voiceBtn.classList.remove('recording');
  });
}

if (voiceBtn) {
  voiceBtn.addEventListener('click', () => {
    if (!recognition) {
      addMessage('Voice input is not supported in this browser.', 'bot');
      return;
    }

    if (!isRecording) {
      isRecording = true;
      voiceBtn.classList.add('recording');
      recognition.start();
    } else {
      isRecording = false;
      voiceBtn.classList.remove('recording');
      recognition.stop();
    }
  });
}

// Text-to-speech
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}
