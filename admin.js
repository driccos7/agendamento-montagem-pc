import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const senhaCorreta = "1234"; // 🔴 MUDE ISSO

function login() {
  if (document.getElementById("senha").value !== senhaCorreta) {
    alert("Senha errada");
    return;
  }
  carregar();
}

window.login = login;

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
