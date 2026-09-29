<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../cs3_config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS meeting_logs ( 
        id INT PRIMARY KEY AUTO_INCREMENT, 
        student_id INTEGER NOT NULL, 
        meeting_date DATE NOT NULL, 
        meeting_time TIME NOT NULL, 
        meeting_type VARCHAR(100) NOT NULL, 
        meeting_format VARCHAR(50) NOT NULL, 
        meeting_notes TEXT, 
        decisions_made TEXT, 
        next_steps TEXT, 
        follow_up_date DATE, 

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) 
    )"; 
    
    $pdo->exec($sql);
    echo "Table 'meeting_logs' created successfully.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}



?>