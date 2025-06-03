import api from './api.js';
import { redes as redesOriginais } from "./data_redes.js";

let redes = [];

// Carrega redes do localStorage ou do arquivo original
async function carregarRedes() {
    redes = await api.read('redes'); // <-- Atualiza a variável global
    const tbody = document.getElementById('redesTableBody');
    tbody.innerHTML = '';
    redes.forEach(rede => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${rede.rede}</td>
      <td>${rede.descricao}</td>
      <td>${rede.ips}</td>
      <td><span class="${rede.statusClass || ''}">${rede.status}</span></td>
      <td>
        <button onclick="editarRede(${rede.id})">Editar</button>
        <button onclick="removerRede(${rede.id})">Remover</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function salvarRedes() {
    localStorage.setItem("redes", JSON.stringify(redes));
}

function renderRedes() {
    const tableBody = document.getElementById("redesTableBody");
    tableBody.innerHTML = "";

    redes.forEach(rede => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${rede.rede}</td>
            <td>${rede.descricao}</td>
            <td>${rede.ips}</td>
            <td><span class="${rede.statusClass}">${rede.status}</span></td>
            <td>
                <button class="btn btn-primary">Detalhes</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Exemplo de alertas dinâmicos (opcional)
function renderAlertas() {
    const alertas = [
        { texto: "<strong>Conflito de IP:</strong> 192.168.1.45 detectado em dois dispositivos" },
        { texto: "<strong>Rede com capacidade crítica:</strong> 192.168.1.0/24 com apenas 15 IPs disponíveis" },
        { texto: "<strong>DHCP indisponível:</strong> Servidor DHCP na VLAN TI não respondeu às 10:45" }
    ];
    const ul = document.getElementById("alertasRecentes");
    if (!ul) return;
    ul.innerHTML = "";
    alertas.forEach(a => {
        const li = document.createElement("li");
        li.style.padding = "10px 0";
        li.style.borderBottom = "1px solid #eee";
        li.innerHTML = a.texto;
        ul.appendChild(li);
    });
}

async function adicionarRede(novaRede) {
    await api.create('redes', novaRede);
    carregarRedes();
}

// Função para abrir e fechar o modal
function setupModalRede() {
    const modal = document.getElementById("modalRede");
    const btn = document.getElementById("addRedeBtn");
    const fechar = document.getElementById("fecharModal");
    const form = document.getElementById("formRede");

    btn.onclick = () => { modal.style.display = "flex"; };
    fechar.onclick = () => { modal.style.display = "none"; };
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        await adicionarRede({
            rede: data.rede,
            descricao: data.descricao,
            ips: Number(data.ips),
            status: data.status,
            statusClass: data.status === "Ativa" ? "status-active" : "status-inativa"
        });
        form.reset();
        modal.style.display = "none";
    };
}

window.editarRede = function(id) {
    // Implemente a lógica de edição
    alert('Editar rede ' + id);
};

window.removerRede = async function(id) {
    if (confirm('Deseja remover esta rede?')) {
        await api.remove(`redes/${id}`);
        carregarRedes();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    carregarRedes();
    renderAlertas();
    setupModalRede();
});

