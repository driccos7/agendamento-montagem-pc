import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Firebase
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

// 🔹 Inputs
const nomeInput = document.getElementById("nome");
const servicoInput = document.getElementById("servico");
const dataInput = document.getElementById("data");
const horaInput = document.getElementById("hora");
const form = document.getElementById("formAgendamento");

// 🔹 Mensagens
function mostrarMsg(texto, tipo = "success") {
  const msg = document.getElementById("msg");
  msg.className = `alert alert-${tipo} mt-3 text-center`;
  msg.innerText = texto;
  msg.classList.remove("d-none");
}

// 🔹 Bloqueia datas passadas
const hoje = new Date().toISOString().split("T")[0];
dataInput.min = hoje;

// 🔹 Horários base
const horariosBase = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
];

// 🔴 LIMITE DIÁRIO
const LIMITE_DIARIO = 5;

// 🔹 Carrega horários livres + limite diário
async function carregarHorarios(dataSelecionada) {
  horaInput.innerHTML = '<option value="">Escolha um horário</option>';
  horaInput.setAttribute("disabled", true);

  const q = query(
    collection(db, "agendamentos"),
    where("data", "==", dataSelecionada)
  );

  const snap = await getDocs(q);

  // 🔴 Dia lotado
  if (snap.size >= LIMITE_DIARIO) {
    mostrarMsg("Dia lotado. Escolha outra data.", "warning");
    return;
  }

  const ocupados = snap.docs.map(d => d.data().hora);

  horariosBase.forEach(hora => {
    if (!ocupados.includes(hora)) {
      const opt = document.createElement("option");
      opt.value = hora;
      opt.textContent = hora;
      horaInput.appendChild(opt);
    }
  });

  if (horaInput.options.length > 1) {
    horaInput.removeAttribute("disabled");
  }
}

// 🔹 Atualiza horários ao escolher data
dataInput.addEventListener("change", () => {
  document.getElementById("msg").classList.add("d-none");
  if (dataInput.value) {
    carregarHorarios(dataInput.value);
  }
});

// 🔹 Envio do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("msg").classList.add("d-none");

  const nome = nomeInput.value.trim();
  const servico = servicoInput.value;
  const data = dataInput.value;
  const hora = horaInput.value;

  if (!nome || !servico || !data || !hora) {
    mostrarMsg("Preencha todos os campos.", "danger");
    return;
  }

  // 🔒 Segurança extra
  const q = query(
    collection(db, "agendamentos"),
    where("data", "==", data),
    where("hora", "==", hora)
  );

  const existe = await getDocs(q);
  if (!existe.empty) {
    mostrarMsg("Horário já ocupado.", "warning");
    return;
  }

  await addDoc(collection(db, "agendamentos"), {
    nome,
    servico,
    data,
    hora
  });

  const msgZap =
    `Agendamento PC:%0A` +
    `Nome: ${nome}%0A` +
    `Serviço: ${servico}%0A` +
    `Data: ${data}%0A` +
    `Hora: ${hora}`;

  window.open("https://wa.me/5511943266607?text=" + msgZap);

  mostrarMsg("Agendamento realizado com sucesso!", "success");
  form.reset();
  horaInput.setAttribute("disabled", true);
});




