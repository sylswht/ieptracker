<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../cs3_config.php';

try {
    $sql = "TRUNCATE TABLE students";
    $pdo->exec($sql);
    echo "All data has been purged from the table.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}