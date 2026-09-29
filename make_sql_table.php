<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../cs3_config.php';
try {
    $sql = "CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(50) NOT NULL,
        service_type VARCHAR(255) NOT NULL,
        disability VARCHAR(255) NOT NULL
    )";

    $pdo->exec($sql);
    echo "Table created successfully.";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}


?>