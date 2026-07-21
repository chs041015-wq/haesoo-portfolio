window.chatbotConfig = {
  header: {
    recipient: "TO: HAESOO",
    email: "( HELLO@HAESOO.DEV )",
  },
  greeting: "안녕하세요. 포트폴리오와 작업 방식에 대해 궁금한 점을 물어보세요.",
  suggestions: [
    "어떤 프로젝트를 했나요?",
    "가장 자신 있는 기술은?",
    "함께 일하려면 어떻게 하나요?",
  ],
  dummyResponse: "좋은 질문이에요. 지금은 UI 목업 응답이지만, 다음 단계에서 실제 포트폴리오 데이터와 API를 연결할 예정입니다.",
};

(() => {
  const config = window.chatbotConfig;
  const section = document.querySelector(".chatbot-section");
  const conversation = document.querySelector("[data-chat-log]");
  const form = document.querySelector("[data-chat-form]");
  const input = document.querySelector("[data-chat-input]");
  const sendButton = document.querySelector("[data-chat-send]");
  const recipient = document.querySelector("[data-chat-recipient]");
  const email = document.querySelector("[data-chat-email]");
  const characterMount = document.querySelector("#character-mount");
  const characterFigure = characterMount?.querySelector(".character-figure");
  const characterStatus = document.querySelector("[data-character-status]");
  const floatingButton = document.querySelector(".chatbot-fab");
  const gsap = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const characterStates = ["idle", "thinking", "talking"];

  if (
    !section ||
    !conversation ||
    !form ||
    !input ||
    !sendButton ||
    !recipient ||
    !email ||
    !characterMount ||
    !characterFigure ||
    !characterStatus ||
    !floatingButton
  ) {
    return;
  }

  let isResponding = false;
  let suggestionsElement = null;
  let scrollCorrectionTimer = 0;

  const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

  const scrollConversationToBottom = () => {
    window.requestAnimationFrame(() => {
      conversation.scrollTo({
        top: conversation.scrollHeight,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });
  };

  const animateCharacterVisual = (state) => {
    if (!gsap) return;

    gsap.killTweensOf(characterFigure);
    gsap.set(characterFigure, { clearProps: "transform" });
    if (reducedMotion.matches) return;

    if (state === "thinking") {
      gsap.to(characterFigure, {
        rotation: 6,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      return;
    }

    if (state === "talking") {
      gsap.to(characterFigure, {
        y: -20,
        scaleY: 1.025,
        duration: 0.24,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      return;
    }

    gsap.to(characterFigure, {
      y: -14,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  };

  const setCharacterState = (state) => {
    const nextState = characterStates.includes(state) ? state : "idle";
    characterStates.forEach((name) => characterMount.classList.remove(`is-${name}`));
    characterMount.classList.add(`is-${nextState}`);
    characterMount.dataset.characterState = nextState;
    characterStatus.textContent = nextState.toUpperCase();
    animateCharacterVisual(nextState);
    characterMount.dispatchEvent(new CustomEvent("characterstatechange", {
      detail: { state: nextState },
    }));
  };

  const appendBubble = (sender, message) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble is-${sender}`;
    bubble.textContent = message;
    conversation.appendChild(bubble);
    scrollConversationToBottom();
    return bubble;
  };

  const appendLoadingBubble = () => {
    const bubble = document.createElement("div");
    const dots = document.createElement("span");
    bubble.className = "chat-bubble is-bot is-loading";
    dots.className = "chat-loading-dots";
    dots.setAttribute("aria-label", "Haesoo is typing");

    for (let index = 0; index < 3; index += 1) {
      dots.appendChild(document.createElement("i"));
    }

    bubble.appendChild(dots);
    conversation.appendChild(bubble);
    scrollConversationToBottom();
    return bubble;
  };

  const removeSuggestions = () => {
    suggestionsElement?.remove();
    suggestionsElement = null;
  };

  const setControlsDisabled = (disabled) => {
    input.disabled = disabled;
    sendButton.disabled = disabled;
    conversation.setAttribute("aria-busy", String(disabled));
    suggestionsElement?.querySelectorAll("button").forEach((button) => {
      button.disabled = disabled;
    });
  };

  const sendMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || isResponding) return;

    isResponding = true;
    setControlsDisabled(true);
    removeSuggestions();
    appendBubble("user", message);
    input.value = "";
    setCharacterState("thinking");

    const loadingBubble = appendLoadingBubble();
    await wait(1000);
    loadingBubble.remove();

    setCharacterState("talking");
    const responseBubble = appendBubble("bot", config.dummyResponse);
    if (gsap && !reducedMotion.matches) {
      gsap.from(responseBubble, {
        opacity: 0,
        y: 10,
        duration: 0.32,
        ease: "power2.out",
      });
    }

    await wait(reducedMotion.matches ? 0 : 650);
    setCharacterState("idle");
    isResponding = false;
    setControlsDisabled(false);
    input.focus({ preventScroll: true });
  };

  const appendSuggestions = () => {
    suggestionsElement = document.createElement("div");
    suggestionsElement.className = "chat-suggestions";
    suggestionsElement.setAttribute("aria-label", "Suggested questions");

    config.suggestions.forEach((label) => {
      const button = document.createElement("button");
      button.className = "chat-suggestion";
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        void sendMessage(label);
      });
      suggestionsElement.appendChild(button);
    });

    conversation.appendChild(suggestionsElement);
  };

  recipient.textContent = config.header.recipient;
  email.textContent = config.header.email;
  appendBubble("bot", config.greeting);
  appendSuggestions();
  setCharacterState("idle");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void sendMessage(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    form.requestSubmit();
  });

  floatingButton.addEventListener("click", () => {
    window.clearTimeout(scrollCorrectionTimer);
    section.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });

    if (!reducedMotion.matches) {
      scrollCorrectionTimer = window.setTimeout(() => {
        const correction = section.getBoundingClientRect().top;
        if (Math.abs(correction) > 1) {
          window.scrollTo({
            top: window.scrollY + correction,
            behavior: "auto",
          });
        }
      }, 900);
    }
  });

  const setFloatingButtonHidden = (hidden) => {
    floatingButton.classList.toggle("is-hidden", hidden);
    floatingButton.setAttribute("aria-hidden", String(hidden));
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      setFloatingButtonHidden(entry.isIntersecting);
    });
  }, { threshold: 0.05 });

  sectionObserver.observe(section);

  reducedMotion.addEventListener?.("change", () => {
    animateCharacterVisual(characterMount.dataset.characterState || "idle");
  });

  window.chatbotController = {
    config,
    sendMessage,
    setCharacterState,
    getState: () => characterMount.dataset.characterState,
  };
})();
