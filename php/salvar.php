<?php
header('Content-Type: application/json');

$dados = json_decode(file_get_contents("php://input"), true);

if ($dados) {
    $nome = $dados['nome'];
    $sexo = $dados['sexo'];
    $historico = $dados['historico'];
    $agitarMaos = $dados['agitarMaos'];

    $servidor = "localhost";
    $usuario = "root";
    $senha = "";
    $banco = "x_fragil_db";

    $conexao = new mysqli($servidor, $usuario, $senha, $banco);

    if ($conexao->connect_error) {
        echo json_encode(["status" => "erro", "mensagem" => "Falha na conexão"]);
        exit;
    }

    $sql = "INSERT INTO pacientes (nome, sexo, historico_familia, agitar_maos) VALUES ('$nome', '$sexo', '$historico', '$agitarMaos')";

    if ($conexao->query($sql) === TRUE) {
        echo json_encode(["status" => "sucesso", "mensagem" => "Dados salvos com sucesso!"]);
    } else {
        echo json_encode(["status" => "erro", "mensagem" => $conexao->error]);
    }

    $conexao->close();
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhum dado recebido"]);
}
?>