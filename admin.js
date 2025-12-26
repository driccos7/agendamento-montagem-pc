import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔐 Senha do admin
const senhaCorreta = "pc2025"; // já configurada

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

// 🔹 Função de login
function login() {
  const senha = document.getElementById("senha").value;
  if (senha !== senhaCorreta) {
    alert("Senha errada");
    return;
  }
  document.getElementById("senha").value = "";
  carregar(); // só carrega se a senha estiver correta
}

// 🔹 Função para carregar agendamentos
async function carregar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const dados = await getDocs(collection(db, "agendamentos"));
  dados.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${d.data().nome} - ${d.data().data} ${d.data().hora} 
      <button>❌</button>
    `;

    const btn = li.querySelector("button");
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "agendamentos", d.id));
      carregar();
    });

    lista.appendChild(li);
  });
}

window.login = login;

