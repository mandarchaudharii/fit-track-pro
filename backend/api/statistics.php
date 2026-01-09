<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$stmt = $conn->prepare(
  "SELECT COUNT(*) as workouts FROM workouts WHERE user_id=?"
);
$stmt->bind_param("i", $user);
$stmt->execute();

echo json_encode(["success"=>true,"data"=>$stmt->get_result()->fetch_assoc()]);
