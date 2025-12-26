import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const senhaCorreta = "pc2025"; // 🔴 MUDE ISSO

function login() {
  if (document.getElementById("senha").value !== senhaCorreta) {
    alert("Senha errada");
    return;
  }
  carregar();
}

window.login = login;

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

async function carregar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const dados = await getDocs(collection(db, "agendamentos"));
  dados.forEach(d => {
    lista.innerHTML += `
      <li>
        ${d.data().nome} - ${d.data().data} ${d.data().hora}
        <button onclick="remover('${d.id}')">❌</button>
      </li>`;
  });
}

window.remover = async (id) => {
  await deleteDoc(doc(db, "agendamentos", id));
  carregar();
};
