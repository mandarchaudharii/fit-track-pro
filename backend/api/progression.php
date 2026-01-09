<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare(
  "INSERT INTO progression_plans
   (user_id,exercise_id,start_weight,increment,frequency,target_weight,current_weight)
   VALUES (?,?,?,?,?,?,?)"
);
$stmt->bind_param(
  "iidssdd",
  $user,
  $data["exercise_id"],
  $data["start"],
  $data["increment"],
  $data["frequency"],
  $data["target"],
  $data["start"]
);
$stmt->execute();

echo json_encode(["success"=>true]);
