<?php
header('Content-Type: application/json');
include 'conexao.php'; 

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido."]);
    exit;
}

$nome = $dados['nome'];
$email = $dados['email'];
$telefone = $dados['telefone'];
$senha = $dados['senha']; 

try {
    $sqlVerifica = "SELECT * FROM usuario_aplicativo WHERE email = ?";
    $stmtVerifica = $pdo->prepare($sqlVerifica);
    $stmtVerifica->execute([$email]);

    if ($stmtVerifica->rowCount() > 0) {
        echo json_encode(["status" => "erro", "mensagem" => "Este e-mail já está cadastrado."]);
        exit;
    }

    $sql = "INSERT INTO usuario_aplicativo (nome_usuario, email, senha, telefone) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nome, $email, $senha, $telefone]);

    echo json_encode(["status" => "sucesso"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "erro", "mensagem" => "Erro no banco de dados: " . $e->getMessage()]);
}
?>