<?php

$mail_to = "jelle@hoest.nl";
$mail_server = "";

// uniek nummer -> bestelnummer
$uid = strtoupper(uniqid(""));

// data
$postdata = file_get_contents("php://input");
$json = json_decode(utf8_encode($postdata));

// verstuur de bestelling-mail
function sendmail($to) {
  global $uid;
  $subject = "Bestelling: " . $uid;
  $html  = "<html><body>";
  $html .= "<h1>Bestelling " . $uid . "</h1>";
  $html .= "<p>Hieronder vindt u het ingevulde bestelformulier:</p>";
  $html .= get_html();
  $html .= "</body></html>";

  return multipartmail($_POST["Naam"], $_POST["E-mail"], $to, $subject, $html);
}

// verstuur het 'bedankt'-mailtje
function sendthanks($to) {
  global $mail_to, $uid;
  $subject = "Bedankt voor uw bestelling";
  $html  = "<html><body>";
  $html .= "<h1>Bestelling verzonden</h1>";
  $html .= "<p>Uw bestelling (nr. " . $uid . ") is verzonden naar " . $mail_to . ", waarvoor dank.</p>";
  $html .= "<p>M.v.g.,</p><p>Afzender<br />" . $mail_to . "</p>";

  return multipartmail("Wireless Sound", $mail_to, $to, $subject, $html);
}

// multipart mail versturen
function multipartmail($name, $from, $to, $subject, $html) {
  $headers  = "From: \"" . strip_tags($name) . "\" <" . strip_tags($from) . ">\n";
  $headers .= "Reply-To: " . strip_tags($from) . "\n";

  $boundary = md5(date('r', time()));

  $headers .= "Content-Type: multipart/alternative;";
  $headers .= " boundary=\"phpMailer-" . $boundary . "\"\n";
  $headers .= "MIME-Version: 1.0\n";
  $headers .= "This is a MIME encoded message.\n";

  // plain text part
  $body  = "--phpMailer-" . $boundary . "\n";
  $body .= "Content-Type: text/plain; charset=\"ISO-8859-1\"\n";
  $body .= "Content-Transfer-Encoding: base64\r\n";
  $body .= chunk_split(base64_encode(strip_tags(preg_replace('/<br(\s+)?\/?>/i', "\n", preg_replace('/<p>/i', "\n\n", $html)))));

  // html part
  $body .= "--phpMailer-" . $boundary . "\n";
  $body .= "Content-Type: text/html; charset=\"ISO-8859-1\"\n";
  $body .= "Content-Transfer-Encoding: base64\r\n";
  $body .= chunk_split(base64_encode($html));
  $body .= "\n--phpMailer-" . $boundary . "--";
  return mail($to, $subject, $body, $headers);
}

function get_html() {
  global $json;
  $form = "<table>";
  foreach ($json as $key => $value) {
    $form .= "<tr>";
    $form .= "<th>$key</th>";
    $form .= "<td>$value</td>";
    $form .= "</tr>";
  }

  $form .= "</table>";

  return $form;
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  exit;
}

$mail_from = $json->{"email"};

header('Content-Type: application/json');
if (sendmail($mail_to) && sendthanks($mail_from)) {
  // redirect naar het bedankje
  echo json_encode({
    "success" => true,
    "input" => $json,
  });
} else {
  // het mailen gaat mis; redirect naar formulier met deze parameter
  echo json_encode({
    "success" => false
    "input" => $json,
  });
}

?>
