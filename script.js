// 🔴 COLE AQUI SEU LINK DO FIREBASE DEPOIS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

  window.open("https://wa.me/55SEUNUMERO?text=" + msg);

  alert("✅ Agendado com sucesso!");
  form.reset();
});

