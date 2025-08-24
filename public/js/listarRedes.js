// Script para listar redes cadastradas no dashboard
async function carregarRedes() {
    const res = await fetch('/dashboard/api/redes');
    const redes = await res.json();
    const tbody = document.getElementById('redesTableBody');
    tbody.innerHTML = '';
    if (Array.isArray(redes) && redes.length > 0) {
        redes.forEach(rede => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${rede.rede}</td>
                <td>${rede.descricao}</td>
                <td>${rede.tipo}</td>
                <td>
                    <button class="btn btn-info" onclick="visualizarAtivos('${rede.id}')">Visualizar Ativos</button>
                    <button class="btn btn-success" onclick="incluirAtivo('${rede.id}')">Incluir Ativo</button>
                    <button class="btn btn-danger" onclick="excluirAtivos('${rede.id}')">Excluir Todos Ativos</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
// Função para visualizar ativos de uma rede em modal fixo do HTML
window.visualizarAtivos = async function(redeId) {
    const res = await fetch(`/dashboard/api/ativos/${redeId}`);
    const ativos = await res.json();
    const modal = document.getElementById('modalVisualizarAtivos');
    const conteudo = document.getElementById('ativosConteudo');
    conteudo.innerHTML = `
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr><th>IP</th><th>MAC</th><th>Descrição</th></tr>
            </thead>
            <tbody>
                ${ativos.length ? ativos.map(a => `<tr><td>${a.ip}</td><td>${a.mac}</td><td>${a.descricao}</td></tr>`).join('') : '<tr><td colspan="3" style="text-align:center;">Nenhum ativo cadastrado.</td></tr>'}
            </tbody>
        </table>
    `;
    modal.style.display = 'flex';
}

document.getElementById('fecharModalVisualizarAtivos').onclick = function() {
    document.getElementById('modalVisualizarAtivos').style.display = 'none';
};
// Fecha modal ao clicar fora do conteúdo
document.getElementById('modalVisualizarAtivos').onclick = function(e) {
    if (e.target === this) this.style.display = 'none';
};

// Função para incluir ativo em uma rede usando modal
window.incluirAtivo = async function(redeId) {
    const modal = document.getElementById('modalAtivo');
    const form = document.getElementById('formAtivo');
    const select = document.getElementById('redeIdSelect');
    // Preencher lista de redes
    const resRedes = await fetch('/dashboard/api/redes');
    const redes = await resRedes.json();
    select.innerHTML = '';
    redes.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.rede;
        if (redeId && r.id == redeId) opt.selected = true;
        select.appendChild(opt);
    });
    modal.style.display = 'flex';
    form.onsubmit = async function(e) {
        e.preventDefault();
        const ip = form.ip.value;
        const mac = form.mac.value;
        const descricao = form.descricao.value;
        const redeIdValue = select.value;
        if (!ip || !mac || !descricao || !redeIdValue) return alert('Preencha todos os campos!');
        const token = localStorage.getItem('token');
        const res = await fetch('/dashboard/api/ativos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ ip, mac, descricao, redeId: redeIdValue })
        });
        const data = await res.json();
        if (data.error) alert(data.error); else alert('Ativo incluído!');
        modal.style.display = 'none';
        form.reset();
    };
};

// Botão cancelar do modal de ativo
document.getElementById('fecharModalAtivo').onclick = function() {
    document.getElementById('modalAtivo').style.display = 'none';
    document.getElementById('formAtivo').reset();
};
// Fecha modal ao clicar fora do conteúdo
document.getElementById('modalAtivo').onclick = function(e) {
    if (e.target === this) {
        this.style.display = 'none';
        document.getElementById('formAtivo').reset();
    }
};

// Função para excluir todos os ativos de uma rede
window.excluirAtivos = async function(redeId) {
    if (!confirm('Deseja excluir TODOS os ativos desta rede?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/dashboard/api/ativos/excluir-todos/${redeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (data.error) alert(data.error); else alert('Todos os ativos excluídos!');
}
    } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhuma rede cadastrada.</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', carregarRedes);
