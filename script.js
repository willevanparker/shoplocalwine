const chatLauncher = document.getElementById("chatLauncher");
const openChatHero = document.getElementById("openChatHero");

function openSophieChat() {
  alert("Sophie chat is coming next. 🍷");
}

if (chatLauncher) {
  chatLauncher.addEventListener("click", openSophieChat);
}

if (openChatHero) {
  openChatHero.addEventListener("click", openSophieChat);
}

const newsletterForm = document.querySelector(".newsletter form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = newsletterForm.querySelector("input[type='email']");
    const email = emailInput.value.trim();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    alert("You're on the list for Sophie's Weekly Pour. 🍷");
    emailInput.value = "";
  });
}
