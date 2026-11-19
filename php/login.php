<?php
session_start();
header('Content-Type: application/json');

include 'conexao.php';

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido."]);
    exit;
}

$email = $dados['email'];
$senha = $dados['senha'];
$perfil = $dados['perfil']; 

try {
    if ($perfil === 'Medico') {
        $sql = "SELECT * FROM medico WHERE email_medico = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            $_SESSION['id_medico'] = $usuario['id_medico'];
            $_SESSION['nome_medico'] = $usuario['nome_medico'];
            $_SESSION['perfil'] = 'Medico';

            echo json_encode(["status" => "sucesso", "perfil" => "Medico"]);
            exit;
        }
    } else {
        $sql = "SELECT * FROM usuario_aplicativo WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && $senha === $usuario['senha']) {
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['nome_usuario'] = $usuario['nome_usuario'];
            $_SESSION['perfil'] = 'Paciente';

            echo json_encode(["status" => "sucesso", "perfil" => "Paciente"]);
            exit;
        }
    }

    echo json_encode(["status" => "erro", "mensagem" => "E-mail ou senha incorretos para o perfil selecionado."]);

} catch (PDOException $e) {
    echo json_encode(["status" => "erro", "mensagem" => "Erro no banco de dados: " . $e->getMessage()]);
}
?>