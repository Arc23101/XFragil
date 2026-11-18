<?php
$host = 'localhost';
$dbname = 'conectafx_db';
$usuario = 'root'; // Altere conforme o seu ambiente
$senha = 'PUC@1234';     // Altere conforme o seu ambiente

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $usuario, $senha);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}
?>