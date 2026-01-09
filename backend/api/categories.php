<?php
require "db.php";
$user = getAuthUser($conn);
if (!$user) exit(json_encode(["success"=>false]));

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $stmt = $conn->prepare(
    "SELECT * FROM categories WHERE user_id=? ORDER BY sort_order"
  );
  $stmt->bind_param("i", $user);
  $stmt->execute();
  echo json_encode(["success"=>true,"data"=>$stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
}

if ($method === "POST") {
  $stmt = $conn->prepare(
    "INSERT INTO categories (user_id,name,sort_order) VALUES (?,?,?)"
  );
  $stmt->bind_param("isi", $user, $data["name"], $data["order"]);
  $stmt->execute();
  echo json_encode(["success"=>true]);
}
