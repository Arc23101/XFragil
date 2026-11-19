<?php
session_start();
header('Content-Type: application/json');
include 'conexao.php';
require_once 'php_jwt.php';

$usuarioToken = conferirTokenJwt();
if (!$usuarioToken) {
    echo json_encode(["status" => "erro", "mensagem" => "Usuário não autenticado: token inválido ou ausente."]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);
if (!$dados) {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido."]);
    exit;
}

$campo = $dados['campo']; 
$valor = $dados['valor'];
$perfil = $usuarioToken['perfil'] ?? $_SESSION['perfil'] ?? ''; 

try {
    if ($perfil === 'Medico') {
        $id_medico = $usuarioToken['id'] ?? $_SESSION['id_medico'];

        if ($campo === 'email') {
            $sql = "UPDATE medico SET email_medico = ? WHERE id_medico = ?";
        } elseif ($campo === 'telefone') {
            $sql = "UPDATE medico SET telefone = ? WHERE id_medico = ?";
        } elseif ($campo === 'senha') {
            $sql = "UPDATE medico SET senha = ? WHERE id_medico = ?"; 
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Campo inválido."]);
            exit;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$valor, $id_medico]);

    } else {
        $id_usuario = $usuarioToken['id'] ?? $_SESSION['id_usuario'];

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