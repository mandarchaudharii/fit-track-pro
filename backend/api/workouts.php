<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"), true);

if ($method === "GET") {
  $stmt = $conn->prepare("SELECT * FROM workouts WHERE user_id=?");
  $stmt->bind_param("i", $user);
  $stmt->execute();
  echo json_encode(["success"=>true,"data"=>$stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
}

if ($method === "POST") {
  $stmt = $conn->prepare(
    "INSERT INTO workouts (user_id,workout_date,duration,notes) VALUES (?,?,?,?)"
  );
  $stmt->bind_param(
    "isis",
    $user,
    $data["date"],
    $data["duration"],
    $data["notes"]
  );
  $stmt->execute();
  echo json_encode(["success"=>true,"data"=>["id"=>$conn->insert_id]]);
}
