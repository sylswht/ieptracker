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
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>My Website</title>
</head>
<body>
	<header>
		<h1>Student Data</h1>
	</header>
	<nav class="navbar">
        <a href="index.html">Home</a>
        <a href="student_create.php">Create Student</a>
        <a href="show_student_profiles.php">Show Data</a>
    </nav>

	<footer>
		<p>&copy; 2025 My Website</p>
	</footer>
</body>
</html>
