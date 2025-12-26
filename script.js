import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// 🔹 CORREÇÃO: capturando os inputs
const nomeInput = document.getElementById("nome");
const servicoInput = document.getElementById("servico");
const dataInput = document.getElementById("data");
const horaInput = document.getElementById("hora");

const form = document.getElementById("formAgendamento");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = nomeInput.value;
  const servico = servicoInput.value;
  const data = dataInput.value;
  const hora = horaInput.value;

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

  await addDoc(collection(db, "agendamentos"), {
    nome, servico, data, hora
  });

  const msg = `Agendamento PC:%0A
Nome: ${nome}%0A
Serviço: ${servico}%0A
Data: ${data}%0A
Hora: ${hora}`;

  window.open("https://wa.me/5511943266607?text=" + msg);

  alert("✅ Agendado com sucesso!");
  form.reset();
});


