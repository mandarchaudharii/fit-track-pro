<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $stmt = $conn->prepare("SELECT * FROM exercises WHERE user_id=?");
  $stmt->bind_param("i", $user);
  $stmt->execute();
  echo json_encode(["success"=>true,"data"=>$stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
}

if ($method === "POST") {
  $stmt = $conn->prepare(
    "INSERT INTO exercises (user_id,name,category_id) VALUES (?,?,?)"
  );
  $stmt->bind_param("isi", $user, $data["name"], $data["category_id"]);
  $stmt->execute();
  echo json_encode(["success"=>true]);
}
