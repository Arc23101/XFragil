<?php
session_start();
include 'conexao.php';

$acao = $_GET['acao'] ?? 'listar';
$perfil = $_SESSION['perfil'] ?? '';

try {
    if ($acao === 'listar') {
        if ($perfil === 'Medico') {
            $id_medico = $_SESSION['id_medico'] ?? 1;
            $sql = "SELECT id_paciente, nome_paciente FROM paciente WHERE id_medico_responsavel = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_medico]);
        } else {
            $id_usuario = $_SESSION['id_usuario'] ?? 1;
            $sql = "SELECT id_paciente, nome_paciente FROM paciente WHERE id_usuario = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_usuario]);
        }

        $pacientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        header('Content-Type: application/json');
        echo json_encode($pacientes);
        exit;
    } 
    elseif ($acao === 'detalhes') {
        $id_paciente = $_GET['id'] ?? null;
        if (!$id_paciente) {
            echo '<div class="tabela">Paciente não especificado.</div>';
            exit;
        }

        if ($perfil === 'Medico') {
            $id_medico = $_SESSION['id_medico'] ?? 1;
            $sql = "SELECT * FROM paciente WHERE id_paciente = ? AND id_medico_responsavel = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_paciente, $id_medico]);
        } else {
            $id_usuario = $_SESSION['id_usuario'] ?? 1;
            $sql = "SELECT * FROM paciente WHERE id_paciente = ? AND id_usuario = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_paciente, $id_usuario]);
        }

        $p = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$p) {
            echo '<div class="tabela">Paciente não encontrado ou sem permissão.</div>';
            exit;
        }

        echo '<div class="tabela" style="width: 100%;">';
        echo '<h3>Dados do Paciente</h3>';
        echo '<strong>Nome:</strong> ' . htmlspecialchars($p['nome_paciente']) . '<br>';
        echo '<strong>Data de Nascimento:</strong> ' . htmlspecialchars($p['data_nascimento']) . '<br>';
        echo '<strong>Etnia:</strong> ' . htmlspecialchars($p['etnia']) . '<br>';
        echo '<strong>Sexo Biológico:</strong> ' . htmlspecialchars($p['sexo_biologico']) . '<br><br>';

        echo '<h3>Respostas do Questionário (Quiz)</h3>';
        echo '<table border="1" cellpadding="8" style="width:100%; border-collapse: collapse; background: #fff;">';
        echo '<tr style="background: #e2e8f0;"><th>Pergunta / Sintoma</th><th>Resposta</th></tr>';
        
        $sintomas = [
            'p1' => '1. Há deficiência intelectual na família?',
            'dificuldade_aprendizado' => '2. Dificuldades no aprendizado?',
            'deficit_atencao' => '3. Déficit de atenção / hiperatividade?',
            'p4' => '4. Atraso para caminhar/engatinhar?',
            'demorou_falar' => '5. Atraso para começar a falar?',
            'fala_repetitiva' => '6. Fala repetitiva / confunde informações?',
            'p7' => '7. Imita movimentos das pessoas?',
            'evita_contato_visual' => '8. Evita contato visual?',
            'evita_contato_fisico' => '9. Evita contato físico?',
            'p9' => '10. Face alongada e mandíbula proeminente?',
            'p10' => '11. Orelhas grandes / abano?',
            'p12' => '12. Pele macia/aveludada?',
            'p13' => '13. Articulações flexíveis?',
            'p14' => '14. Insônia ou ansiedade?',
            'p15' => '15. Descoordenação motora?',
            'p16' => '16. Macroorquidismo (testículos maiores)?',
            'agressividade' => '17. Hiperatividade ou agressividade?',
            'movimentos_repetitivos' => '18. Movimentos repetitivos?',
            'habito_morder_maos' => '19. Hábito de morder as mãos?',
            'p20' => '20. Exame de DNA positivo?',
            'p21' => '21. Casos de X frágil na família?'
        ];

        foreach ($sintomas as $coluna => $textoPergunta) {
            $resposta = isset($p[$coluna]) && $p[$coluna] !== '' ? htmlspecialchars($p[$coluna]) : 'Não informado';
            echo "<tr><td>{$textoPergunta}</td><td style='text-align: center;'><strong>{$resposta}</strong></td></tr>";
        }
        echo '</table><br>';

        echo '<h3>Observações Adicionais</h3>';
        echo '<div style="background: #fff; padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px;">';
        echo !empty($p['observacoes']) ? nl2br(htmlspecialchars($p['observacoes'])) : 'Nenhuma observação registrada.';
        echo '</div>';

        echo '</div>';
    }
} catch (PDOException $e) {
    echo '<div class="tabela">Erro ao consultar o banco de dados.</div>';
}
?>