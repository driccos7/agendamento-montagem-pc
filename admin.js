import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
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
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 DOM
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const lista = document.getElementById("lista");

// 🔐 Login
btnLogin.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      senhaInput.value
    );
  } catch {
    alert("Login inválido");
  }
});

// 🔓 Logout
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
});

// 🔐 Estado de autenticação
onAuthStateChanged(auth, user => {
  if (user) {
    btnLogout.classList.remove("d-none");
    carregarAgendamentos();
  } else {
    lista.innerHTML = "";
    btnLogout.classList.add("d-none");
  }
});

// 📥 Carregar agendamentos
async function carregarAgendamentos() {
  lista.innerHTML = "";
  const snap = await getDocs(collection(db, "agendamentos"));

  snap.forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${d.data().nome} - ${d.data().data} ${d.data().hora}
      <button>❌</button>
    `;

    li.querySelector("button").onclick = async () => {
      await deleteDoc(doc(db, "agendamentos", d.id));
      carregarAgendamentos();
    };

    lista.appendChild(li);
  });
}

