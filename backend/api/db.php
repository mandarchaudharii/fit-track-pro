<?php
$conn = new mysqli("localhost", "DB_USER", "DB_PASS", "DB_NAME");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["success" => false, "error" => "DB error"]);
  exit;
}

header("Content-Type: application/json");

function getAuthUser($conn) {
  $headers = getallheaders();
  if (!isset($headers['Authorization'])) return null;

  $token = str_replace("Bearer ", "", $headers['Authorization']);

  $stmt = $conn->prepare(
    "SELECT user_id FROM sessions WHERE token=? AND expires_at > NOW()"
  );
  $stmt->bind_param("s", $token);
  $stmt->execute();
  $res = $stmt->get_result();

  return $res->num_rows === 1 ? $res->fetch_assoc()['user_id'] : null;
}
