<?php
header('Content-Type: application/json');

// Lê o JSON enviado pelo JavaScript
$dados = json_decode(file_get_contents("php://input"), true);

if ($dados) {
    $email = $dados['email'];
    $senha = $dados['senha'];
    $perfil = $dados['perfil'];

    // Conexão com o MySQL (ajuste usuário, senha e nome do banco)
    $servidor = "localhost";
    $usuario_db = "root";
    $senha_db = "";
    $banco = "x_fragil_db";

    $conexao = new mysqli($servidor, $usuario_db, $senha_db, $banco);

    if ($conexao->connect_error) {
        echo json_encode(["status" => "erro", "mensagem" => "Falha na conexão com o banco de dados."]);
        exit;
    }

    // Consulta SQL procurando pelo e-mail e perfil selecionado
    $sql = "SELECT * FROM usuarios WHERE email = '$email' AND perfil = '$perfil'";
    $resultado = $conexao->query($sql);

    if ($resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();

        // Validação da senha (se estiver salvando texto puro no trabalho acadêmico)
        if ($senha === $usuario['senha']) {
            echo json_encode([
                "status" => "sucesso",
                "perfil" => $usuario['perfil']
            ]);
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Senha incorreta."]);
        }
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "E-mail não encontrado para o perfil selecionado."]);
    }

    $conexao->close();
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido."]);
}
?><?php
header('Content-Type: application/json');
