<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../cs3_config.php';


try {
    $sql = "ALTER TABLE students ADD COLUMN iep_meeting_date DATE NULL";
    $pdo->exec($sql);
    echo "The iep meeting date column was successfully added.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

try {
    $sql = "ALTER TABLE students ADD COLUMN iep_beginning_date DATE NULL";
    $pdo->exec($sql);
    echo "The iep beginning date column was successfully added.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

try {
    $sql = "ALTER TABLE students ADD COLUMN iep_ending_date DATE NULL";
    $pdo->exec($sql);
    echo "The iep ending date column was successfully added.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

try {
    $sql = "ALTER TABLE students ADD COLUMN parent_rights_date DATE NULL";
    $pdo->exec($sql);
    echo "The date of parent rights given column was successfully added.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

try {
    $sql = "ALTER TABLE students ADD COLUMN transition_guide_date DATE NULL";
    $pdo->exec($sql);
    echo "The date of transition guide was given column was successfully added.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>