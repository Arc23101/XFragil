<?php
// Chave secreta para assinar os tokens (mantenha igual em todo o sistema)
define('JWT_SECRET_KEY', 'ConectaFX_Chave_Secreta_2026_#XFragil');

function base64UrlEncode($dados) {
    return rtrim(strtr(base64_encode($dados), '+/', '-_'), '=');
}

function base64UrlDecode($dados) {
    $resto = strlen($dados) % 4;
    if ($resto) {
        $dados .= str_repeat('=', 4 - $resto);
    }
    return base64_decode(strtr($dados, '-_', '+/'));
}

// Gera o token JWT com os dados do usuário
function criarTokenJwt($id, $nome, $email, $perfil) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    
    $payload = json_encode([
        'id' => $id,
        'nome' => $nome,
        'email' => $email,
        'perfil' => $perfil,
        'iat' => time(),
        'exp' => time() + (60 * 60 * 8) // Expira em 8 horas
    ]);

    $base64Header = base64UrlEncode($header);
    $base64Payload = base64UrlEncode($payload);

    $assinatura = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET_KEY, true);
    $base64Assinatura = base64UrlEncode($assinatura);

    return $base64Header . "." . $base64Payload . "." . $base64Assinatura;
}

// Lê o cabeçalho Authorization: Bearer <token> vindo do JavaScript
function obterTokenDoCabecalho() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }

    if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        return $matches[1];
    }
    return null;
}

// Valida o token e retorna os dados do usuário (ou false se for inválido/expirado)
function conferirTokenJwt() {
    $token = obterTokenDoCabecalho();
    if (!$token) {
        return false;
    }

    $partes = explode('.', $token);
    if (count($partes) !== 3) {
        return false;
    }

    list($base64Header, $base64Payload, $base64Assinatura) = $partes;

    $assinaturaEsperada = base64UrlEncode(
        hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET_KEY, true)
    );

    if (!hash_equals($assinaturaEsperada, $base64Assinatura)) {
        return false;
    }

    $payload = json_decode(base64UrlDecode($base64Payload), true);
    if (!$payload || (isset($payload['exp']) && $payload['exp'] < time())) {
        return false;
    }

    return $payload;
}
?>