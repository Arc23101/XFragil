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
        perfil: perfilEl.value, 
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
            if (resultado.token && typeof salvarTokenJwt === 'function') {
                salvarTokenJwt(resultado.token);
            }
            alert("Login realizado com sucesso!");
            if (resultado.perfil === "Medico") {
                window.location.href = "TelaMed.html"; 
            } else {
                window.location.href = "PaciVisaoPaci.html"; 
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

    fetch('../php/salvar.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        },
        body: JSON.stringify(dadosPaciente)
    })
    .then(response => response.json())
    .then(resultado => {
        if(resultado.status === "sucesso") {
            alert("Respostas enviadas com sucesso!");
            localStorage.removeItem('pacienteQuiz');
            window.location.href = "PaciVisaoPaci.html";
        } else {
            alert("Erro ao salvar: " + resultado.mensagem);
        }
    })
    .catch(erro => console.error('Erro:', erro));

}

function carregarPacientes() {
    const selectFiltro = document.getElementById('filtro-pacientes');
    const valorFiltro = selectFiltro.value;
    const containerResultados = document.getElementById('lista-pacientes-container');

    containerResultados.innerHTML = '<div class="tabela">Carregando pacientes do banco de dados...</div>';

    fetch(`../php/buscar_pacientes.php?filtro=${valorFiltro}`, {
        headers: {
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        }
    })
        .then(response => response.text())
        .then(dadosHtml => {
            containerResultados.innerHTML = dadosHtml;
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            containerResultados.innerHTML = '<div class="tabela">Erro ao carregar os dados.</div>';
        });
}

function inicializarTelaMedico() {
    const selectFiltro = document.getElementById('filtro-pacientes');
    if (!selectFiltro) return;

    fetch('../php/buscar_pacientes.php?acao=listar', {
        headers: {
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        }
    })
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
        .catch(error => console.error('Erro ao carregar lista de pacientes:', error));
}


function carregarDetalhesPaciente() {
    const idPaciente = document.getElementById('filtro-pacientes').value;
    const containerResultados = document.getElementById('lista-pacientes-container');

    if (!idPaciente) {
        containerResultados.innerHTML = '<div class="tabela">Selecione um paciente acima para visualizar os dados.</div>';
        return;
    }

    containerResultados.innerHTML = '<div class="tabela">A carregar dados do paciente...</div>';

    fetch(`../php/buscar_pacientes.php?acao=detalhes&id=${idPaciente}`, {
        headers: {
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        }
    })
        .then(response => response.text())
        .then(html => {
            containerResultados.innerHTML = html;
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes:', error);
            containerResultados.innerHTML = '<div class="tabela">Erro ao carregar os dados do paciente.</div>';
        });
}

if (document.getElementById('filtro-pacientes')) {
    document.addEventListener('DOMContentLoaded', inicializarTelaMedico);
}

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

    fetch('../php/atualizar_cadastra.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        },
        body: JSON.stringify(dadosAtualizacao)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.status === "sucesso") {
            alert("Atualizado com sucesso!");
            location.reload(); 
        } else {
            alert("Erro ao atualizar: " + resultado.mensagem);
        }
    })
    .catch(erro => {
        console.error('Erro na requisição:', erro);
        alert("Erro ao conectar com o servidor.");
    });
}

function MudarEmail() { alterarDado('email'); }
function MudarTelefone() { alterarDado('telefone'); }
function MudarSenha() { alterarDado('senha'); }


function inicializarTelaPacienteUser() {
    const selectFiltro = document.getElementById('filtro-pacientes-user');
    if (!selectFiltro) return;

    fetch('../php/buscar_pacientes.php?acao=listar', {
        headers: {
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        }
    })
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

function carregarDetalhesPacienteUser() {
    const idPaciente = document.getElementById('filtro-pacientes-user').value;
    const containerResultados = document.getElementById('lista-pacientes-user-container');

    if (!idPaciente) {
        containerResultados.innerHTML = '<div class="tabela">Selecione um paciente acima para visualizar os dados.</div>';
        return;
    }

    containerResultados.innerHTML = '<div class="tabela">Carregando dados...</div>';

    fetch(`../php/buscar_pacientes.php?acao=detalhes&id=${idPaciente}`, {
        headers: {
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        }
    })
        .then(response => response.text())
        .then(html => {
            containerResultados.innerHTML = html;
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes:', error);
            containerResultados.innerHTML = '<div class="tabela">Erro ao carregar os dados.</div>';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('filtro-pacientes-user')) {
        inicializarTelaPacienteUser();
    }
});


function gravar() {
    const nome = document.getElementById('regNome').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const telefone = document.getElementById('regTelefone').value.trim();
    const senha = document.getElementById('regSenha').value;
    const senhaConf = document.getElementById('regSenhaConf').value;

    if (!nome || !email || !telefone || !senha || !senhaConf) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (senha !== senhaConf) {
        alert("As senhas não coincidem!");
        return;
    }

    const dadosRegistro = {
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha
    };

    fetch('../PHP/registrar_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosRegistro)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.status === "sucesso") {
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            window.location.href = "login.html";
        } else {
            alert("Erro ao cadastrar: " + resultado.mensagem);
        }
    })
    .catch(erro => {
        console.error('Erro na requisição:', erro);
        alert("Erro ao conectar com o servidor.");
    });
}
function avancarQuiz1() {
    const nomeP = document.getElementById('nomeP').value.trim();
    const dataNasci = document.getElementById('dataNasci').value;
    const sexoSelected = document.querySelector('input[name="sexo"]:checked');

    if (!nomeP || !dataNasci || !sexoSelected) {
        alert("Por favor, preencha o Nome, a Data de Nascimento e o Sexo do paciente antes de continuar.");
        return;
    }

    let dadosGerais = JSON.parse(localStorage.getItem('dadosQuizXFragil')) || {};

    dadosGerais['NomeP'] = nomeP;
    dadosGerais['dataNasci'] = dataNasci;
    dadosGerais['etinia'] = document.getElementById('etinia').value.trim();
    dadosGerais['sexo'] = sexoSelected.value;

    const nomesCampos = ['p1', 'dificuldade_aprendizado', 'deficit_atencao', 'p4', 'demorou_falar', 'fala_repetitiva', 'p7'];
    
    for (let campo of nomesCampos) {
        const selecionado = document.querySelector(`input[name="${campo}"]:checked`);
        if (selecionado) {
            dadosGerais[campo] = selecionado.value;
        }
    }

    localStorage.setItem('dadosQuizXFragil', JSON.stringify(dadosGerais));
    window.location.href = 'quiz2.html';
}

function enviarQuizFinal() {
    let dadosGerais = JSON.parse(localStorage.getItem('dadosQuizXFragil')) || {};

    for (let i = 8; i <= 14; i++) { 
        const selecionada = document.querySelector(`input[name="q${i}"]:checked`);
        if (selecionada) {
            dadosGerais[`q${i}`] = selecionada.value;
        }
    }

    fetch('../PHP/salvar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        },
        body: JSON.stringify(dadosGerais)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.status === "sucesso") {
            alert("Quiz salvo com sucesso!");
            localStorage.removeItem('dadosQuizXFragil'); 
            window.location.href = "PaciVisaoPaci.html";
        } else {
            alert("Atenção: " + resultado.mensagem); 
        }
    })
    .catch(erro => console.error('Erro:', erro));
}


function voltarQuiz1() {
    let dadosGerais = JSON.parse(localStorage.getItem('dadosQuizXFragil')) || {};

    const nomesCamposQuiz2 = [
        'evita_contato_visual', 'evita_contato_fisico', 'p9', 'p10', 'p12', 
        'p13', 'p14', 'p15', 'p16', 'agressividade', 'movimentos_repetitivos', 
        'habito_morder_maos', 'p20', 'p21'
    ];

    for (let campo of nomesCamposQuiz2) {
        const selecionado = document.querySelector(`input[name="${campo}"]:checked`);
        if (selecionado) {
            dadosGerais[campo] = selecionado.value;
        }
    }

    const obs = document.getElementById('observacoes');
    if (obs) {
        dadosGerais['observacoes'] = obs.value;
    }

    localStorage.setItem('dadosQuizXFragil', JSON.stringify(dadosGerais));
    window.location.href = 'quiz1.html';
}

function finalizarQuiz() {
    let dadosGerais = JSON.parse(localStorage.getItem('dadosQuizXFragil')) || {};

    const nomesCamposQuiz2 = [
        'evita_contato_visual', 'evita_contato_fisico', 'p9', 'p10', 'p12', 
        'p13', 'p14', 'p15', 'p16', 'agressividade', 'movimentos_repetitivos', 
        'habito_morder_maos', 'p20', 'p21'
    ];

    for (let campo of nomesCamposQuiz2) {
        const selecionado = document.querySelector(`input[name="${campo}"]:checked`);
        if (selecionado) {
            dadosGerais[campo] = selecionado.value;
        }
    }

    const obs = document.getElementById('observacoes');
    if (obs) {
        dadosGerais['observacoes'] = obs.value;
    }

    fetch('../php/salvar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (typeof pegarTokenJwt === 'function' ? pegarTokenJwt() : '')
        },
        body: JSON.stringify(dadosGerais)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.status === "sucesso") {
            alert("Quiz salvo com sucesso!");
            localStorage.removeItem('dadosQuizXFragil'); 
            window.location.href = "PaciVisaoPaci.html"; 
        } else {
            alert("Atenção: " + resultado.mensagem);
        }
    })
    .catch(erro => {
        console.error('Erro na requisição:', erro);
        alert("Erro ao conectar com o servidor.");
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const selectFiltro = document.getElementById('filtro-pacientes');
    if (selectFiltro) {
        inicializarTelaMedico();
    }
});