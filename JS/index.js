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

    const email = inputEmail.value;
    const senha = inputSenha.value;

    if (!email || !senha) {
        alert("Por favor, preencha o e-mail e a senha.");
        return;
    }

    const dadosLogin = {
        perfil: perfilEl.value, // "Medico" ou "Paciente"
        email: email,
        senha: senha
    };

    fetch('../php/login.php', {
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
            // Redireciona com base no perfil retornado pelo banco
            if (resultado.perfil === "Medico") {
                window.location.href = "TelaMed.html"; // Nome exato do arquivo
            } else {
                window.location.href = "PaciVisaoPaci.html"; // Ou a tela inicial do paciente
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

function carregarPacientes() {
    const selectFiltro = document.getElementById('filtro-pacientes');
    const valorFiltro = selectFiltro.value;
    const containerResultados = document.getElementById('lista-pacientes-container');

    // Mensagem temporária de carregamento
    containerResultados.innerHTML = '<div class="tabela">Carregando pacientes do banco de dados...</div>';

    // Requisição assíncrona para o arquivo PHP
    fetch(`../php/buscar_pacientes.php?filtro=${valorFiltro}`)
        .then(response => response.text())
        .then(dadosHtml => {
            // Atualiza a div com os dados retornados pelo PHP
            containerResultados.innerHTML = dadosHtml;
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            containerResultados.innerHTML = '<div class="tabela">Erro ao carregar os dados.</div>';
        });
}

// Carregar a lista de pacientes do médico ao abrir a tela do médico
// Função para carregar a lista de pacientes no <select> do médico
function inicializarTelaMedico() {
    const selectFiltro = document.getElementById('filtro-pacientes');
    if (!selectFiltro) return;

    fetch('../php/buscar_pacientes.php?acao=listar')
        .then(response => response.json())
        .then(pacientes => {
            // Mantém apenas a opção padrão e limpa o resto
            selectFiltro.innerHTML = '<option value="">-- Selecione um paciente --</option>';
            
            pacientes.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id_paciente;
                option.textContent = p.nome_paciente;
                selectFiltro.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar lista de pacientes:', error));
}

// Quando o médico seleciona um paciente específico no dropdown
// Quando o médico seleciona um paciente específico no dropdown
function carregarDetalhesPaciente() {
    const idPaciente = document.getElementById('filtro-pacientes').value;
    const containerResultados = document.getElementById('lista-pacientes-container');

    if (!idPaciente) {
        containerResultados.innerHTML = '<div class="tabela">Selecione um paciente acima para visualizar os dados.</div>';
        return;
    }

    containerResultados.innerHTML = '<div class="tabela">A carregar dados do paciente...</div>';

    fetch(`../php/buscar_pacientes.php?acao=detalhes&id=${idPaciente}`)
        .then(response => response.text())
        .then(html => {
            containerResultados.innerHTML = html;
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes:', error);
            containerResultados.innerHTML = '<div class="tabela">Erro ao carregar os dados do paciente.</div>';
        });
}

// Executa ao carregar a página do médico
if (document.getElementById('filtro-pacientes')) {
    document.addEventListener('DOMContentLoaded', inicializarTelaMedico);
}

// Função genérica para atualizar dados do usuário/médico logado
function alterarDado(campo) {
    let titulo = "";
    if (campo === 'email') titulo = "Digite o novo e-mail:";
    if (campo === 'telefone') titulo = "Digite o novo telefone:";
    if (campo === 'senha') titulo = "Digite a nova senha:";

    const novoValor = prompt(titulo);
    if (!novoValor || novoValor.trim() === "") return;

    const dadosAtualizacao = {
        campo: campo,
        valor: novoValor.trim()
    };

    fetch('../PHP/atualizar_cadastro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizacao)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.status === "sucesso") {
            alert("Atualizado com sucesso!");
            location.reload(); // Recarrega a tela para refletir
        } else {
            alert("Erro ao atualizar: " + resultado.mensagem);
        }
    })
    .catch(erro => {
        console.error('Erro na requisição:', erro);
        alert("Erro ao conectar com o servidor.");
    });
}

// Funções chamadas pelos botões nas telas de config
function MudarEmail() { alterarDado('email'); }
function MudarTelefone() { alterarDado('telefone'); }
function MudarSenha() { alterarDado('senha'); }


// Carrega os pacientes associados ao usuário logado na tela do paciente
function inicializarTelaPacienteUser() {
    const selectFiltro = document.getElementById('filtro-pacientes-user');
    if (!selectFiltro) return;

    fetch('../php/buscar_pacientes.php?acao=listar')
        .then(response => response.json())
        .then(pacientes => {
            selectFiltro.innerHTML = '<option value="">-- Selecione um paciente --</option>';
            pacientes.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id_paciente;
                option.textContent = p.nome_paciente;
                selectFiltro.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar lista de pacientes do usuário:', error));
}

// Carrega os detalhes do paciente selecionado pelo usuário
function carregarDetalhesPacienteUser() {
    const idPaciente = document.getElementById('filtro-pacientes-user').value;
    const containerResultados = document.getElementById('lista-pacientes-user-container');

    if (!idPaciente) {
        containerResultados.innerHTML = '<div class="tabela">Selecione um paciente acima para visualizar os dados.</div>';
        return;
    }

    containerResultados.innerHTML = '<div class="tabela">Carregando dados...</div>';

    fetch(`../php/buscar_pacientes.php?acao=detalhes&id=${idPaciente}`)
        .then(response => response.text())
        .then(html => {
            containerResultados.innerHTML = html;
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes:', error);
            containerResultados.innerHTML = '<div class="tabela">Erro ao carregar os dados.</div>';
        });
}

// Inicializa automaticamente ao carregar a página do paciente
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('filtro-pacientes-user')) {
        inicializarTelaPacienteUser();
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const selectFiltro = document.getElementById('filtro-pacientes');
    if (selectFiltro) {
        inicializarTelaMedico();
    }
});