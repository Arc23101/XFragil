<?php
// Inicia a sessão para identificar qual usuário está logado
session_start();

// Desativa a exibição direta de erros na tela para não corromper o JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// Inclui a conexão PDO existente no projeto
include 'conexao.php'; 

// Verifica se o usuário está logado na sessão (ajuste o nome da variável de sessão se necessário, ex: $_SESSION['id_usuario'])
$id_usuario = $_SESSION['id_usuario'] ?? 1; // Fallback temporário para 1 caso teste direto sem login

// Lê o JSON enviado pelo fetch do JavaScript
$json = file_get_contents("php://input");
$dados = json_decode($json, true);

if (!$dados) {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido pelo servidor."]);
    exit;
}

try {
    // 1. Dados cadastrais vindos do Quiz 1
    $nome_paciente = $dados['NomeP'] ?? '';
    $data_nascimento = $dados['dataNasci'] ?? null;
    $etnia = $dados['etnia'] ?? '';
    $sexo_biologico = $dados['sexo'] ?? '';
    $observacoes = $dados['observacoes'] ?? '';

    // Se a data vier vazia, define como null para evitar erro no banco
    if (empty($data_nascimento)) {
        $data_nascimento = null;
    }

    // 2. Respostas das Perguntas da Parte 1
    $p1 = $dados['p1'] ?? '';
    $dificuldade_aprendizado = $dados['dificuldade_aprendizado'] ?? '';
    $deficit_atencao = $dados['deficit_atencao'] ?? '';
    $p4 = $dados['p4'] ?? '';
    $demorou_falar = $dados['demorout_falar'] ?? $dados['demorou_falar'] ?? '';
    $fala_repetitiva = $dados['fala_repetitiva'] ?? '';
    $p7 = $dados['p7'] ?? '';

    // 3. Respostas das Perguntas da Parte 2
    $evita_contato_visual = $dados['evita_contato_visual'] ?? '';
    $evita_contato_fisico = $dados['evita_contato_fisico'] ?? '';
    $p9 = $dados['p9'] ?? '';
    $p10 = $dados['p10'] ?? '';
    $p12 = $dados['p12'] ?? '';
    $p13 = $dados['p13'] ?? '';
    $p14 = $dados['p14'] ?? '';
    $p15 = $dados['p15'] ?? '';
    $p16 = $dados['p16'] ?? '';
    $agressividade = $dados['agressividade'] ?? '';
    $movimentos_repetitivos = $dados['movimentos_repetitivos'] ?? '';
    $habito_morder_maos = $dados['habito_morder_maos'] ?? '';
    $p20 = $dados['p20'] ?? '';
    $p21 = $dados['p21'] ?? '';

    // Query de inserção mapeando exatamente os nomes das colunas da tabela `paciente` do seu SQL
    $sql = "INSERT INTO paciente (
                id_usuario, nome_paciente, data_nascimento, etnia, sexo_biologico, 
                p1, dificuldade_aprendizado, deficit_atencao, p4, demorou_falar, fala_repetitiva, p7,
                evita_contato_visual, evita_contato_fisico, p9, p10, p12, p13, p14, p15, p16, 
                agressividade, movimentos_repetitivos, habito_morder_maos, p20, p21, observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id_usuario, $nome_paciente, $data_nascimento, $etnia, $sexo_biologico,
        $p1, $dificuldade_aprendizado, $deficit_atencao, $p4, $demorou_falar, $fala_repetitiva, $p7,
        $evita_contato_visual, $evita_contato_fisico, $p9, $p10, $p12, $p13, $p14, $p15, $p16,
        $agressividade, $movimentos_repetitivos, $habito_morder_maos, $p20, $p21, $observacoes
    ]);

    echo json_encode(["status" => "sucesso", "mensagem" => "Quiz salvo com sucesso!"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "erro", "mensagem" => "Erro no banco de dados: " . $e->getMessage()]);
}
?>