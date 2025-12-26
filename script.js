import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCclgaKtHJ_fKlDcuhsf_hoPOMrVSAhQvk",
  authDomain: "agendamento-montagem-pc-5c626.firebaseapp.com",
  projectId: "agendamento-montagem-pc-5c626",
  storageBucket: "agendamento-montagem-pc-5c626.firebasestorage.app",
  messagingSenderId: "787900616308",
  appId: "1:787900616308:web:d025d073090f395d7c4b21"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Captura dos inputs do formulário
const nomeInput = document.getElementById("nome");
const servicoInput = document.getElementById("servico");
const dataInput = document.getElementById("data");
const horaInput = document.getElementById("hora");

function mostrarMsg(texto, tipo = "success") {
  const msg = document.getElementById("msg");
  msg.className = `alert alert-${tipo} mt-3 text-center`;
  msg.innerText = texto;
  msg.classList.remove("d-none");
}

const form = document.getElementById("formAgendamento");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = nomeInput.value.trim();
  const servico = servicoInput.value.trim();
  const data = dataInput.value;
  const hora = horaInput.value;

  // 🔹 Verifica se algum campo está vazio
  if (!nome || !servico || !data || !hora) {
    mostrarMsg("Preencha todos os campos.", "danger");

    return;
  }

  // 🔹 Checa se o horário já existe no Firebase
  const q = query(
    collection(db, "agendamentos"),
    where("data", "==", data),
    where("hora", "==", hora)
  );

  const existe = await getDocs(q);
  if (!existe.empty) {
    alert("⛔ Horário já ocupado!");
    return;
  }

  // 🔹 Abre o WhatsApp imediatamente (funciona no iPhone)
  const msg = `Agendamento PC:%0ANome: ${nome}%0AServiço: ${servico}%0AData: ${data}%0AHora: ${hora}`;
  window.open("https://wa.me/5511943266607?text=" + msg);

  // 🔹 Salva o agendamento no Firebase
  await addDoc(collection(db, "agendamentos"), {
    nome, servico, data, hora
  });

  alert("✅ Agendado com sucesso!");
  form.reset();
});



