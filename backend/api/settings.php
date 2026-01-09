<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare(
  "REPLACE INTO settings (user_id,settings_json) VALUES (?,?)"
);
$json = json_encode($data);
$stmt->bind_param("is", $user, $json);
$stmt->execute();

echo json_encode(["success"=>true]);
