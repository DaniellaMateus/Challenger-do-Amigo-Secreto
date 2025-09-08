let amigos = JSON.parse(localStorage.getItem("amigos")) || [];
let historicoSorteio = JSON.parse(localStorage.getItem("historicoSorteio")) || [];
let sorteioFeito = false;

// Emojis
const emojis = ["🎉", "🥳", "✨", "💖", "🎁", "🎊", "🌟"];

// Atualizar lista
function atualizarLista() {
  const lista = document.getElementById("listaAmigos");
  lista.innerHTML = "";
  amigos.forEach((amigo) => {
    const li = document.createElement("li");
    li.textContent = `${amigo.nome} ${amigo.emoji}`;
    lista.appendChild(li);
  });

  localStorage.setItem("amigos", JSON.stringify(amigos));
}

// Atualizar histórico
function atualizarHistorico() {
  const hist = document.getElementById("historico");
  if (!hist) return;
  hist.innerHTML = "";
  historicoSorteio.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    hist.appendChild(li);
  });
  localStorage.setItem("historicoSorteio", JSON.stringify(historicoSorteio));
}

// Limpar resultado 
function limparResultado() {
  const resultado = document.getElementById("resultado");
  if (resultado) resultado.innerHTML = "";
}

//  Reiniciar jogo
function reiniciarJogo() {
  amigos = [];
  historicoSorteio = [];
  sorteioFeito = false;
  atualizarLista();
  atualizarHistorico();
  limparResultado();
  localStorage.clear();
}

//  Valida nome (apenas letras, não aceita apenas espaços) 
function validarNome(nome) {
  return /^[A-Za-zÀ-ú\s]+$/.test(nome);
}

// Mostrar tela de erro quando nenhum nome é informado 
function mostrarErroNome() {
  document.documentElement.style.backgroundColor = "white";
  document.body.style.backgroundColor = "white";
  document.body.style.margin = "0";
  document.body.style.height = "100vh";
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";
  document.body.style.justifyContent = "center";
  document.body.style.alignItems = "center";
  document.body.style.textAlign = "center";

  document.body.innerHTML = `
    <h1 style="color:red; font-size:2em;">⚠️ Informe o nome de um amigo válido!</h1>
    <button id="voltar" style="
      margin-top:20px; 
      padding:10px 20px; 
      font-size:1em; 
      cursor:pointer;
      border:none;
      background-color:#007bff;
      color:white;
      border-radius:5px;
    ">Voltar ao jogo</button>
  `;

  document.getElementById("voltar").addEventListener("click", () => {
    location.reload();
  });
}

//  Adicionar amigo 
function adicionarAmigo() {
  const input = document.getElementById("amigo");
  const nome = input.value.trim();

  if (sorteioFeito) reiniciarJogo();

  if (nome === "") {
    alert("Por favor, insira um nome válido!");
    return;
  }

  if (!validarNome(nome)) {
    alert("O nome deve conter apenas letras e espaços!");
    return;
  }

  if (amigos.some(a => a.nome === nome)) {
    alert("Este nome já está na lista!");
    return;
  }

  //  emoji fixo
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  amigos.push({ nome, emoji });
  atualizarLista();

  input.value = "";
  input.focus();
}

//  Sortear amigo
function sortearAmigo() {
  const resultado = document.getElementById("resultado");

  if (amigos.length === 0) {
    mostrarErroNome();
    return;
  }

  const indice = Math.floor(Math.random() * amigos.length);
  const sorteado = amigos[indice];

  // "Sorteando..." com ⏳
  resultado.innerHTML = `<li style="opacity:0;">⏳ Sorteando...</li>`;
  const el = resultado.querySelector("li");
  el.animate(
    [{ transform: "scale(1)", opacity: 0 }, { transform: "scale(1.1)", opacity: 1 }, { transform: "scale(1)", opacity: 1 }],
    { duration: 800 }
  );

  // Espera 1 segundos antes de resultado
  setTimeout(() => {
    resultado.innerHTML = `<li id="sorteado" style="font-weight:bold; font-size:1.2em;">Amigo sorteado: ${sorteado.nome} ${sorteado.emoji}</li>`;
    const elSorteado = document.getElementById("sorteado");
    elSorteado.animate(
      [{ transform: "scale(1)", opacity: 0 }, { transform: "scale(1.2)", opacity: 1 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 1000 }
    );
  }, 1000); // 1000ms = 1 segundos

  // Remove da lista e adiciona ao histórico
  amigos.splice(indice, 1);
  historicoSorteio.push(`${sorteado.nome} ${sorteado.emoji}`);
  atualizarLista();
  atualizarHistorico();

  sorteioFeito = true;
}

//funcionalidade para o botão Enter
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("amigo");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") adicionarAmigo();
    });
  }

  atualizarLista();
  atualizarHistorico();
});

// Expor funções para HTML 
window.adicionarAmigo = adicionarAmigo;
window.sortearAmigo = sortearAmigo;
window.reiniciarJogo = reiniciarJogo;