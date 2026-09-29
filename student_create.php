<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../cs3_config.php';

if (isset($_POST['AddStudent'])) {
    try {
        $student_name = trim($_POST['student_name'] ?? '');
        $service_type = trim($_POST['service_type'] ?? '');
        $disability = trim($_POST['disability'] ?? '');

        if ($student_name === '' || $service_type === '' || $disability === '') {
            echo "Please fill in all fields.";
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO students (student_name, service_type, disability)
                VALUES (:student_name, :service_type, :disability)
            ");

            $stmt->execute([
                ':student_name' => $student_name,
                ':service_type' => $service_type,
                ':disability' => $disability
            ]);

            echo "Student added successfully.";
        }

    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Create a Student</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <nav class="navbar">
        <a href="index.html">Home</a>
        <a href="student_create.php">Create Student</a>
        <a href="show_student_profiles.php">Show Data</a>
    </nav>

    <div class="title">
        <h1>Create a Student</h1>
    </div>

    <div class="login-container">

        <form method="POST" action="student_create.php">

            <p>
                Student Name:
                <input
                    class="form-input"
                    type="text"
                    name="student_name"
                    placeholder="Name, etc."
                    required
                >
            </p>

            <p>
                Service:
                <input
                    class="form-input"
                    type="text"
                    name="service_type"
                    placeholder="..."
                    required
                >
            </p>

            <p>
                Disability:
                <input
                    class="form-input"
                    type="text"
                    name="disability"
                    placeholder="..."
                    required
                >
            </p>

            <button type="submit" name="AddStudent">
                <strong>Add Student</strong>
            </button>

            <p>
                Ready to go back?
                <a href="index.html">Home</a>
            </p>

        </form>

    </div>

</body>
</html>