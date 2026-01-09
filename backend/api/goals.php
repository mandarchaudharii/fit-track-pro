<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare(
  "INSERT INTO goals (user_id,title,target_value,due_date) VALUES (?,?,?,?)"
);
$stmt->bind_param("isds", $user, $data["title"], $data["target"], $data["due"]);
$stmt->execute();

echo json_encode(["success"=>true]);
