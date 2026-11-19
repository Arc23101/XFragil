// Salva o token no navegador depois que o login dá certo
function salvarTokenJwt(token) {
    localStorage.setItem('meuTokenJwt', token);
}

// Pega o token salvo para mandar nas requisições
function pegarTokenJwt() {
    return localStorage.getItem('meuTokenJwt');
}

// Apaga o token quando o usuário sair
function apagarTokenJwt() {
    localStorage.removeItem('meuTokenJwt');
}

// Função para o botão "Sair"
function sairDoSistema() {
    apagarTokenJwt();
    localStorage.removeItem('dadosQuizXFragil');
    localStorage.removeItem('pacienteQuiz');
    window.location.href = "../index.html";
}

// Verifica se a pessoa tem o token antes de deixar ela ficar nas páginas internas
function bloquearSeNaoTiverToken() {
    const paginaAtual = window.location.pathname.toLowerCase();

    const paginasPublicas = ['index.html', 'login.html', 'registro.html'];
    const ehPublica = paginasPublicas.some(pagina => paginaAtual.endsWith(pagina)) || paginaAtual.endsWith('/');

    if (!ehPublica) {
        const token = pegarTokenJwt();
        if (!token) {
            alert("Acesso bloqueado! Faça login primeiro.");
            window.location.href = "../index.html";
        }
    }
}

// Roda a verificação assim que a página abre
bloquearSeNaoTiverToken();