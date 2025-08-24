// Função utilitária para obter o token salvo
function getToken() {
    return localStorage.getItem('token');
}

// Função para criar rede autenticada
async function criarRedeAutenticada(data) {
    const token = getToken();
    const res = await fetch('/dashboard/api/add-rede', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}

// Exemplo de uso no submit do formulário:
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRede');
    const modal = document.getElementById('modalRede');
    const btn = document.getElementById('addRedeBtn');
    const fechar = document.getElementById('fecharModal');

    if (btn && modal) {
        btn.onclick = () => { modal.style.display = 'flex'; };
    }
    if (fechar && modal) {
        fechar.onclick = () => { modal.style.display = 'none'; };
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }

    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            // Validação simples
            if (!data.rede || !data.descricao || !data.tipo) {
                alert('Preencha todos os campos!');
                return;
            }
            const result = await criarRedeAutenticada(data);
            if (result.error) {
                alert(result.error);
            } else {
                alert('Rede criada com sucesso!');
                form.reset();
                modal.style.display = 'none';
                window.location.reload();
            }
        };
    }
});
