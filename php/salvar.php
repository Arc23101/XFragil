<?php
session_start();

ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

include 'conexao.php'; 
require_once 'php_jwt.php';

$usuarioToken = conferirTokenJwt();
if (!$usuarioToken) {
    echo json_encode(["status" => "erro", "mensagem" => "Acesso negado: token inválido ou ausente."]);
    exit;
}

$id_usuario = $usuarioToken['id'] ?? $_SESSION['id_usuario'] ?? 1;

$json = file_get_contents("php://input");
$dados = json_decode($json, true);

if (!$dados) {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido pelo servidor."]);
    exit;
}

try {
    $nome_paciente = $dados['NomeP'] ?? '';
    $data_nascimento = $dados['dataNasci'] ?? null;
    $etnia = $dados['etnia'] ?? '';
    $sexo_biologico = $dados['sexo'] ?? '';
    $observacoes = $dados['observacoes'] ?? '';

    if (empty($data_nascimento)) {
        $data_nascimento = null;
    }

    $p1 = $dados['p1'] ?? '';
    $dificuldade_aprendizado = $dados['dificuldade_aprendizado'] ?? '';
    $deficit_atencao = $dados['deficit_atencao'] ?? '';
    $p4 = $dados['p4'] ?? '';
    $demorou_falar = $dados['demorout_falar'] ?? $dados['demorou_falar'] ?? '';
    $fala_repetitiva = $dados['fala_repetitiva'] ?? '';
    $p7 = $dados['p7'] ?? '';

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