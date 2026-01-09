<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare(
  "INSERT INTO measurement_entries (measurement_type_id,value,entry_date)
   VALUES (?,?,?)"
);
$stmt->bind_param("ids", $data["type_id"], $data["value"], $data["date"]);
$stmt->execute();

echo json_encode(["success"=>true]);
