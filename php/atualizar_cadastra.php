<?php
session_start();
header('Content-Type: application/json');
include 'conexao.php';

// Verifica se há alguém logado
if (!isset($_SESSION['perfil'])) {
    echo json_encode(["status" => "erro", "mensagem" => "Usuário não autenticado."]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);
if (!$dados) {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido."]);
    exit;
}

$campo = $dados['campo']; // 'email', 'telefone', ou 'senha'
$valor = $dados['valor'];
$perfil = $_SESSION['perfil']; // 'Medico' ou 'Paciente'

try {
    if ($perfil === 'Medico') {
        $id_medico = $_SESSION['id_medico'];

        if ($campo === 'email') {
            $sql = "UPDATE medico SET email_medico = ? WHERE id_medico = ?";
        } elseif ($campo === 'telefone') {
            // Se sua tabela médico tiver telefone, adicione aqui, senão ajuste conforme o banco
            $sql = "UPDATE medico SET telefone = ? WHERE id_medico = ?";
        } elseif ($campo === 'senha') {
            // Nota: Se salvar senha pura ou com hash, ajuste aqui
            $sql = "UPDATE medico SET senha = ? WHERE id_medico = ?"; 
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Campo inválido."]);
            exit;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$valor, $id_medico]);

    } else {
        // Perfil Paciente / Usuário do Aplicativo
        $id_usuario = $_SESSION['id_usuario'];

        if ($campo === 'email') {
            $sql = "UPDATE usuario_aplicativo SET email = ? WHERE id_usuario = ?";
        } elseif ($campo === 'telefone') {
            $sql = "UPDATE usuario_aplicativo SET telefone = ? WHERE id_usuario = ?";
        } elseif ($campo === 'senha') {
            $sql = "UPDATE usuario_aplicativo SET senha = ? WHERE id_usuario = ?";
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Campo inválido."]);
            exit;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$valor, $id_usuario]);
    }

    echo json_encode(["status" => "sucesso"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "erro", "mensagem" => "Erro no banco de dados: " . $e->getMessage()]);
}
?>