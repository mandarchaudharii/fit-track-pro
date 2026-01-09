<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $stmt = $conn->prepare("SELECT * FROM routines WHERE user_id=?");
  $stmt->bind_param("i", $user);
  $stmt->execute();
  echo json_encode(["success"=>true,"data"=>$stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
}

if ($method === "POST") {
  $stmt = $conn->prepare(
    "INSERT INTO routines (user_id,name,notes) VALUES (?,?,?)"
  );
  $stmt->bind_param("iss", $user, $data["name"], $data["notes"]);
  $stmt->execute();
  echo json_encode(["success"=>true]);
}
