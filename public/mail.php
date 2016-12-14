<?php

// uniek nummer -> bestelnummer
$uid = strtoupper(uniqid(""));

// data
$postdata = file_get_contents("php://input");
$json = json_decode(utf8_encode($postdata));

// from data
$mail_to = "the.official.wireless.inc@gmail.com";
$mail_name = $json->{"name"};
$mail_from = $json->{"email"};

// verstuur de bestelling-mail
function sendmail($to) {
  global $uid, $mail_name, $mail_from;
  $subject = "Bestelling: " . $uid;
  $html  = "<html><body>";
  $html .= "<h1>Bestelling " . $uid . "</h1>";
  $html .= "<p>Hieronder vindt u het ingevulde bestelformulier:</p>";
  $html .= get_html();
  $html .= "</body></html>";

  return multipartmail($mail_name, $mail_from, $to, $subject, $html);
}

// verstuur het 'bedankt'-mailtje
function sendthanks($to) {
  global $mail_to, $uid;
  $subject = "Bedankt voor uw bestelling";
  $html  = "<html><body>";
  $html .= "<h1>Bestelling verzonden</h1>";
  $html .= "<p>Uw bestelling (nr. " . $uid . ") is verzonden naar " . $mail_to . ", waarvoor dank.</p>";
  $html .= "<p>Hieronder vindt u het ingevulde bestelformulier:</p>";
  $html .= get_html();
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
    $label = $key;
    $_value = $value;
    if ($key == 'name') {
      $label = 'Naam';
    }
    else if ($key == 'email') {
      $label = 'Emailadres';
    }
    else if ($key == 'address') {
      $label = 'Adres';
    }
    else if ($key == 'zipcode') {
      $label = 'Postcode';
    }
    else if ($key == 'city') {
      $label = 'Plaats';
    }
    else if ($key == 'number') {
      $label = 'Aantal';
    }
    else if ($key == 'total') {
      $label = 'Prijs';
      $_value = number_format(intval($json->{'number'}) * 18, 2, ',', '');
    }

    $form .= "<tr>";
    $form .= "<th>$label</th>";
    $form .= "<td>$_value</td>";
    $form .= "</tr>";
  }

  $form .= "</table>";

  return $form;
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  exit;
}

header('Content-Type: application/json');
if (!empty($mail_to) && !empty($mail_from) && !empty($mail_name)) {
  if (sendmail($mail_to) && sendthanks($mail_from)) {
    // redirect naar het bedankje
    echo json_encode([
      "success" => true,
    ]);
  } else {
    // het mailen gaat mis; redirect naar formulier met deze parameter
    echo json_encode([
      "success" => false,
      "error" => true
    ]);
  }
}
else {
  echo json_encode([
    "success" => false,
    "valid" => false
  ]);
}

?>
