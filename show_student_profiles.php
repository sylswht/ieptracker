<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../cs3_config.php';


try {
    $sql = "SELECT * FROM students";
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>Data Display</title>
    <link rel="stylesheet" href="style.css">
</head>
 <nav class="navbar">
        <a href="index.html">Home</a>
        <a href="student_create.php">Create Student</a>
        <a href="show_student_profiles.php">Show Data</a>
    </nav>
<body>
    <table border = "1">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Service Type</th>
            <th>Disability</th>
        </tr>
        <?php foreach ($rows as $row): ?>
            <tr>
                <td><?= $row['id']; ?></td>
                <td><?= $row['student_name']; ?></td>
                <td><?= $row['service_type']; ?></td>
                <td><?= $row['disability']; ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>