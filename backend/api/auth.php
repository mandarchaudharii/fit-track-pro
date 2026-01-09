<?php
require "db.php";
$action = $_GET["action"] ?? "";
$data = json_decode(file_get_contents("php://input"), true);

if ($action === "register") {
  $pass = password_hash($data["password"], PASSWORD_DEFAULT);
  $stmt = $conn->prepare(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)"
  );
  $stmt->bind_param("sss", $data["name"], $data["email"], $pass);
  $stmt->execute();
  echo json_encode(["success" => true]);
}

if ($action === "login") {
  $stmt = $conn->prepare(
    "SELECT id,password,name FROM users WHERE email=?"
  );
  $stmt->bind_param("s", $data["email"]);
  $stmt->execute();
  $res = $stmt->get_result()->fetch_assoc();

  if ($res && password_verify($data["password"], $res["password"])) {
    $token = bin2hex(random_bytes(32));
    $exp = date("Y-m-d H:i:s", strtotime("+30 days"));

    $stmt = $conn->prepare(
      "INSERT INTO sessions (user_id,token,expires_at) VALUES (?,?,?)"
    );
    $stmt->bind_param("iss", $res["id"], $token, $exp);
    $stmt->execute();

    echo json_encode([
      "success" => true,
      "data" => [
        "token" => $token,
        "user" => ["id"=>$res["id"],"name"=>$res["name"]]
      ]
    ]);
  } else {
    http_response_code(401);
    echo json_encode(["success"=>false,"error"=>"Invalid credentials"]);
  }
}
