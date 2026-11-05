function executarRestauracao() {
    const dadosSalvos = JSON.parse(localStorage.getItem('pacienteQuiz'));
    if (!dadosSalvos) return;

    // Se estiver na Página 1
    if (document.getElementById('formQuiz1')) {
        if (dadosSalvos.nome) {
            document.getElementById('nomeP').value = dadosSalvos.nome;
        }
        if (dadosSalvos.sexo) {
            const radioSexo = document.querySelector(`input[name="sexo"][value="${dadosSalvos.sexo}"]`);
            if (radioSexo) radioSexo.checked = true;
        }
        // Restaura as respostas de p1 a p7
        for (let i = 1; i <= 7; i++) {
            if (dadosSalvos[`p${i}`]) {
                const radio = document.querySelector(`input[name="p${i}"][value="${dadosSalvos[`p${i}`]}"]`);
                if (radio) radio.checked = true;
            }
        }
    }

    // Se estiver na Página 2
    if (document.getElementById('formQuiz2')) {
        // Restaura as respostas de p8 a p14
        for (let i = 8; i <= 14; i++) {
            if (dadosSalvos[`p${i}`]) {
                const radio = document.querySelector(`input[name="p${i}"][value="${dadosSalvos[`p${i}`]}"]`);
                if (radio) radio.checked = true;
            }
        }
    }
}

// Garante que a restauração ocorre quer o DOM já esteja pronto quer ainda esteja a carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executarRestauracao);
} else {
    executarRestauracao();
}

// Salva automaticamente sempre que qualquer input do formulário for alterado
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

// Avança da Página 1 para a Página 2
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

// Volta da Página 2 para a Página 1
function salvarPagina2EVoltar() {
    window.location.href = "quiz.html";
}

// Finaliza e envia para o PHP/Base de Dados
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
}