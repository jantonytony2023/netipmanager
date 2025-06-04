import api from './api.js';

let redes = [];

// Carrega e exibe as redes na tabela
async function carregarRedes() {
    redes = await api.read('redes');
    const tbody = document.getElementById('redesTableBody');
    tbody.innerHTML = '';
    redes.forEach(rede => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rede.rede}</td>
            <td>${rede.descricao}</td>
            <td>${rede.tipo}</td>
            <td>
                <button class="btn btn-info" title="Visualizar Ativos" onclick="window.visualizarAtivos('${rede.id}')">
                    <img src="https://img.icons8.com/ios-glyphs/20/000000/visible--v1.png" alt="Visualizar">
                </button>
                <button class="btn btn-success" title="Adicionar Ativo" onclick="window.abrirModalAtivo('${rede.id}')">
                    <img src="https://img.icons8.com/ios-glyphs/20/26e07f/plus-math.png" alt="Adicionar">
                </button>
                <button class="btn btn-warning" title="Editar" onclick="window.editarRede('${rede.id}')">
                    <img src="https://img.icons8.com/ios-glyphs/20/faad14/edit--v1.png" alt="Editar">
                </button>
                <button class="btn btn-danger" title="Remover" onclick="window.removerRede('${rede.id}')">
                    <img src="https://img.icons8.com/ios-glyphs/20/fa314a/trash.png" alt="Remover">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    setupModalAtivo(); // Preenche o select de redes do modal de ativos
}



// Modal de adicionar rede
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

        // Expressão regular para validar IP/CIDR
        const cidrRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\/([0-9]|[1-2][0-9]|3[0-2])$/;

        if (!cidrRegex.test(data.rede)) {
            alert('O campo "Rede" deve estar no formato xxx.xxx.xxx.xxx/xx (ex: 192.168.1.0/24)');
            form.rede.focus();
            return;
        }

        if (data.id) {
            // Editar
            await api.update(`redes/${data.id}`, {
                rede: data.rede,
                descricao: data.descricao,
                tipo: data.tipo
            });
        } else {
            // Criar
            await api.create('redes', {
                rede: data.rede,
                descricao: data.descricao,
                tipo: data.tipo
            });
        }
        form.reset();
        document.getElementById("redeIdInput").value = "";
        modal.style.display = "none";
        carregarRedes();
    };
}

// Modal de adicionar ativo
function setupModalAtivo() {
    const modal = document.getElementById("modalAtivo");
    const btn = document.getElementById("addAtivoBtn");
    const fechar = document.getElementById("fecharModalAtivo");
    const form = document.getElementById("formAtivo");

    // Preencher o select de redes
    const select = document.getElementById("redeIdSelect");
    select.innerHTML = "";
    redes.forEach(rede => {
        const option = document.createElement("option");
        option.value = rede.id;
        option.textContent = rede.rede + " - " + rede.descricao;
        select.appendChild(option);
    });

    btn.onclick = () => { modal.style.display = "flex"; };
    fechar.onclick = () => { modal.style.display = "none"; };
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const redeSelecionada = redes.find(r => r.id === data.redeId);

        // Validação: IP do ativo deve pertencer à faixa da rede
        if (!ipPertenceFaixa(data.ip, redeSelecionada.rede)) {
            alert(`O IP informado não pertence à faixa da rede selecionada (${redeSelecionada.rede})`);
            form.ip.focus();
            return;
        }

        // Expressão regular para validar MAC
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (!macRegex.test(data.mac)) {
            alert('O campo "MAC" deve estar no formato XX:XX:XX:XX:XX:XX ou XX-XX-XX-XX-XX-XX');
            form.mac.focus();
            return;
        }

        await api.create('ativos', {
            ip: data.ip,
            mac: data.mac,
            descricao: data.descricao,
            redeId: data.redeId
        });
        form.reset();
        modal.style.display = "none";
    };
}

// Função global para remover rede
window.removerRede = async function(id) {
    if (confirm('Deseja remover esta rede?')) {
        await api.remove(`redes/${id}`);
        carregarRedes();
    }
};

// Função global para visualizar ativos
window.visualizarAtivos = async function(redeId) {
    const ativos = await api.read('ativos');
    const ativosDaRede = ativos.filter(a => a.redeId === redeId);

    const conteudo = document.getElementById("ativosConteudo");
    if (ativosDaRede.length) {
        conteudo.innerHTML = ativosDaRede.map(a => `
            <div style="margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #eee;">
                <strong>IP:</strong> ${a.ip}<br>
                <strong>MAC:</strong> ${a.mac}<br>
                <strong>Descrição:</strong> ${a.descricao}<br>
                <button class="btn btn-danger btn-sm" onclick="window.removerAtivo('${a.id}')">
                    <img src="https://img.icons8.com/ios-glyphs/16/fa314a/trash.png" alt="Remover">
                    Remover
                </button>
            </div>
        `).join('');
    } else {
        conteudo.innerHTML = "<em>Nenhum ativo cadastrado nesta rede.</em>";
    }

    document.getElementById("modalVisualizarAtivos").style.display = "flex";
};

// Fechar o modal de visualização de ativos
document.getElementById("fecharModalVisualizarAtivos").onclick = function() {
    document.getElementById("modalVisualizarAtivos").style.display = "none";
};
// Fecha ao clicar fora do conteúdo
document.getElementById("modalVisualizarAtivos").onclick = function(e) {
    if (e.target === this) this.style.display = "none";
};

// Função global para editar rede
window.editarRede = function(id) {
    const rede = redes.find(r => r.id === id);
    if (!rede) return;
    document.getElementById("redeIdInput").value = rede.id;
    document.querySelector("#formRede [name=rede]").value = rede.rede;
    document.querySelector("#formRede [name=descricao]").value = rede.descricao;
    document.querySelector("#formRede [name=tipo]").value = rede.tipo;
    document.getElementById("modalRede").style.display = "flex";
};

// Função global para remover ativo
window.removerAtivo = async function(id) {
    if (confirm('Deseja remover este ativo?')) {
        await api.remove(`ativos/${id}`);
        // Atualiza a visualização dos ativos no modal
        // Descobre a rede do ativo removido para atualizar corretamente
        const ativoRemovido = await api.read(`ativos/${id}`);
        window.visualizarAtivos(ativoRemovido.redeId);
        // Ou, se não conseguir pegar o redeId, feche e reabra o modal manualmente
        document.getElementById("modalVisualizarAtivos").style.display = "none";
    }
};

// Função para verificar se um IP pertence a uma faixa CIDR
function ipPertenceFaixa(ip, cidr) {
    function ipToInt(ip) {
        return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0);
    }
    const [rede, mascara] = cidr.split('/');
    const ipInt = ipToInt(ip);
    const redeInt = ipToInt(rede);
    const mask = ~(2 ** (32 - mascara) - 1);
    return (ipInt & mask) === (redeInt & mask);
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarRedes();
    renderAlertas();
    setupModalRede();
});

window.abrirModalAtivo = function(redeId) {
    const modal = document.getElementById("modalAtivo");
    const select = document.getElementById("redeIdSelect");
    if (select) {
        select.value = redeId;
    }
    modal.style.display = "flex";
};

