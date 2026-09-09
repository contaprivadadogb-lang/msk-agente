const API_URL = "https://msk-agente.vercel.app/";

const messagesEl = document.getElementById("messages");
const emptyEl = document.getElementById("empty");
const form = document.getElementById("form");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

function addMessage(text, who) {
  if (emptyEl) emptyEl.remove();
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function setSending(sending) {
  sendBtn.disabled = sending;
  input.disabled = sending;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || sendBtn.disabled) return;

  addMessage(text, "user");
  input.value = "";
  input.focus();

  const typing = addMessage("Processando...", "typing");
  setSending(true);

  try {
    const res = await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });
    
    const data = await res.json();
    typing.remove();

    if (res.ok && data.success) {
      addMessage(data.code || data.message, "bot");
      addMessage("✅ Pronto!", "sent");
    } else {
      addMessage(`Erro: ${data.error || "Tente novamente"}`, "error");
    }
  } catch (err) {
    typing.remove();
    addMessage("❌ Falha: " + err.message, "error");
  }

  setSending(false);
  input.focus();
});
