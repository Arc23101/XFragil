function entrar1() {                window.location.href = "TelaPaci.html";
}function entrar2() {                window.location.href = "TelaMed.html";
}

function entrar() {
    const perfilEl = document.querySelector('input[name="perfil"]:checked');
    const inputEmail = document.getElementById('emailLogin');
    const inputSenha = document.getElementById('senhaLogin');

    if (!perfilEl) {
        alert("Por favor, selecione se você é Médico ou Paciente.");
        return;
    }
    if (!inputEmail || !inputSenha) {
        alert("Erro: Campos de login não encontrados nesta página.");
        return;
    }

    const email = inputEmail.value;
    const senha = inputSenha.value;

    if (!email || !senha) {
        alert("Por favor, preencha o e-mail e a senha.");
        return;
    }

    const dadosLogin = {
        perfil: perfilEl.value,
        email: email,
        senha: senha
    };

    fetch('../PHP/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.status === "sucesso") {
            alert("Login realizado com sucesso!");
            if (resultado.perfil === "Medico") {
                window.location.href = "tela_medico.html";
            } else {
                window.location.href = "Quiz.html";
            }
        } else {
            alert("Erro no login: " + resultado.mensagem);
        }
    })
    .catch(erro => {
        console.error('Erro na requisição:', erro);
        alert("Erro ao conectar com o servidor.");
    });
}

function executarRestauracao() {
    const dadosSalvos = JSON.parse(localStorage.getItem('pacienteQuiz'));
    if (!dadosSalvos) return;

    if (document.getElementById('formQuiz1')) {
        if (dadosSalvos.nome) {
            document.getElementById('nomeP').value = dadosSalvos.nome;
        }
        if (dadosSalvos.sexo) {
            const radioSexo = document.querySelector(`input[name="sexo"][value="${dadosSalvos.sexo}"]`);
            if (radioSexo) radioSexo.checked = true;
        }
        for (let i = 1; i <= 7; i++) {
            if (dadosSalvos[`p${i}`]) {
                const radio = document.querySelector(`input[name="p${i}"][value="${dadosSalvos[`p${i}`]}"]`);
                if (radio) radio.checked = true;
            }
        }
    }

    if (document.getElementById('formQuiz2')) {
        for (let i = 8; i <= 14; i++) {
            if (dadosSalvos[`p${i}`]) {
                const radio = document.querySelector(`input[name="p${i}"][value="${dadosSalvos[`p${i}`]}"]`);
                if (radio) radio.checked = true;
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executarRestauracao);
} else {
    executarRestauracao();
}

document.addEventListener("change", function () {
    let dadosPaciente = JSON.parse(localStorage.getItem('pacienteQuiz')) || {};

    const nomeInput = document.getElementById('nomeP');
    if (nomeInput) dadosPaciente.nome = nomeInput.value;

    const sexoEl = document.querySelector('input[name="sexo"]:checked');
    if (sexoEl) dadosPaciente.sexo = sexoEl.value;

    for (let i = 1; i <= 14; i++) {
        const resp = document.querySelector(`input[name="p${i}"]:checked`);
        if (resp) {
            dadosPaciente[`p${i}`] = resp.value;
        }
    }

    localStorage.setItem('pacienteQuiz', JSON.stringify(dadosPaciente));
});

function proximaPagina() {
    const nome = document.getElementById('nomeP').value;
    const sexoEl = document.querySelector('input[name="sexo"]:checked');

    if (!nome || !sexoEl) {
        alert("Por favor, preencha o nome e selecione o sexo do paciente.");
        return;
    }

    let dadosParciais = JSON.parse(localStorage.getItem('pacienteQuiz')) || {};
    dadosParciais.nome = nome;
    dadosParciais.sexo = sexoEl.value;

    for (let i = 1; i <= 7; i++) {
        const resp = document.querySelector(`input[name="p${i}"]:checked`);
        if (!resp) {
            alert(`Por favor, responda à pergunta ${i} antes de continuar.`);
            return;
        }
        dadosParciais[`p${i}`] = resp.value;
    }

    localStorage.setItem('pacienteQuiz', JSON.stringify(dadosParciais));
    window.location.href = "quiz2.html";
}

function salvarPagina2EVoltar() {
    window.location.href = "quiz.html";
}

function finalizarQuiz() {
    let dadosPaciente = JSON.parse(localStorage.getItem('pacienteQuiz')) || {};

    for (let i = 8; i <= 14; i++) {
        const resp = document.querySelector(`input[name="p${i}"]:checked`);
        if (!resp) {
            alert(`Por favor, responda à pergunta ${i} antes de finalizar.`);
            return;
        }
        dadosPaciente[`p${i}`] = resp.value;
    }

    fetch('../PHP/salvar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPaciente)
    })
    .then(response => response.json())
    .then(resultado => {
        if(resultado.status === "sucesso") {
            alert("Respostas enviadas com sucesso!");
            localStorage.clear();
            window.location.href = "../index.html";
        } else {
            alert("Erro ao salvar: " + resultado.mensagem);
        }
    })
    .catch(erro => console.error('Erro:', erro));

    window.location.href = "TelaPaci.html";
}