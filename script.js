// ---------------------------------------------
// Chat panel (launcher + hero CTA open the same panel)
// ---------------------------------------------
const chatLauncher = document.getElementById("chatLauncher");
const openChatHero = document.getElementById("openChatHero");
const chatPanel = document.getElementById("chatPanel");
const chatPanelClose = document.getElementById("chatPanelClose");

function setChatOpen(isOpen) {
  if (!chatPanel || !chatLauncher) return;

  chatPanel.setAttribute("data-open", String(isOpen));
  chatLauncher.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    const chatInput = document.getElementById("chatInput");
    setTimeout(() => {
      if (chatInput) chatInput.focus();
    }, 100);
  }
}

function toggleChat() {
  if (!chatPanel) return;

  const isOpen = chatPanel.getAttribute("data-open") === "true";
  setChatOpen(!isOpen);
}

if (chatLauncher) {
  chatLauncher.addEventListener("click", toggleChat);
}

if (openChatHero) {
  openChatHero.addEventListener("click", () => setChatOpen(true));
}

if (chatPanelClose) {
  chatPanelClose.addEventListener("click", () => setChatOpen(false));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setChatOpen(false);
  }
});

document.addEventListener("click", (event) => {
  if (!chatPanel || chatPanel.getAttribute("data-open") !== "true") return;

  const clickedInsidePanel = chatPanel.contains(event.target);
  const clickedLauncher = chatLauncher && chatLauncher.contains(event.target);
  const clickedHeroCta = openChatHero && openChatHero.contains(event.target);

  if (!clickedInsidePanel && !clickedLauncher && !clickedHeroCta) {
    setChatOpen(false);
  }
});


// ---------------------------------------------
// Ask Bria chat
// ---------------------------------------------
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

function addChatMessage(text, sender) {
  if (!chatMessages) return;

  const message = document.createElement("div");
  message.className = `chat-message ${sender}`;
  message.textContent = text;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return message;
}

function setChatBusy(isBusy) {
  if (!chatForm || !chatInput) return;

  chatForm.dataset.busy = String(isBusy);
  chatInput.disabled = isBusy;

  const submitButton = chatForm.querySelector("button");
  if (submitButton) {
    submitButton.disabled = isBusy;
    submitButton.textContent = isBusy ? "Sending..." : "Send";
  }
}

if (chatForm && chatInput && chatMessages) {
  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addChatMessage(userMessage, "user");
    chatInput.value = "";

    const thinkingMessage = addChatMessage("Thinking...", "bria");
    setChatBusy(true);

    try {
      const response = await fetch("/.netlify/functions/ask-bria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      let data = {};
      try {
        data = await response.json();
      } catch (jsonError) {
        data = {};
      }

      if (thinkingMessage) {
        thinkingMessage.remove();
      }

      if (!response.ok) {
        addChatMessage(
          data.error || "Sorry, Bria had trouble answering that. Please try again.",
          "bria"
        );
        return;
      }

      addChatMessage(
        data.reply || "Sorry, I had trouble answering that. Try again?",
        "bria"
      );
    } catch (error) {
      if (thinkingMessage) {
        thinkingMessage.remove();
      }

      addChatMessage(
        "Sorry, Bria had trouble connecting. Please try again in a moment.",
        "bria"
      );
    } finally {
      setChatBusy(false);
      chatInput.focus();
    }
  });
}


// ---------------------------------------------
// Newsletter form — inline validation, no alert()s
// ---------------------------------------------
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterStatus = document.getElementById("newsletterStatus");

function setNewsletterStatus(message, state) {
  if (!newsletterStatus) return;

  newsletterStatus.textContent = message;
  newsletterStatus.dataset.state = state || "";
}

function isLikelyValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (newsletterForm && newsletterEmail) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = newsletterEmail.value.trim();

    if (!email) {
      newsletterEmail.setAttribute("aria-invalid", "true");
      setNewsletterStatus("Enter your email address to join.", "error");
      newsletterEmail.focus();
      return;
    }

    if (!isLikelyValidEmail(email)) {
      newsletterEmail.setAttribute("aria-invalid", "true");
      setNewsletterStatus("That email address doesn't look quite right.", "error");
      newsletterEmail.focus();
      return;
    }

    newsletterEmail.removeAttribute("aria-invalid");
    setNewsletterStatus("You're on the list for Bria's Weekly Pour. 🍷", "success");
    newsletterEmail.value = "";
  });

  newsletterEmail.addEventListener("input", () => {
    if (newsletterEmail.getAttribute("aria-invalid") === "true") {
      newsletterEmail.removeAttribute("aria-invalid");
      setNewsletterStatus("", "");
    }
  });
}
