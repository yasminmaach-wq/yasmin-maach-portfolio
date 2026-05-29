<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = htmlspecialchars(trim($_POST["name"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $subject = htmlspecialchars(trim($_POST["subject"]));
    $message = htmlspecialchars(trim($_POST["message"]));

    $to = "deine-email@domain.de";

    $mail_subject = "Neue Kontaktanfrage: " . $subject;

    $mail_message = "
    Name: $name\n
    E-Mail: $email\n\n
    Nachricht:\n$message
    ";

    $headers = "From: $email";

    if(mail($to, $mail_subject, $mail_message, $headers)) {
        echo "Nachricht erfolgreich gesendet.";
    } else {
        echo "Fehler beim Senden der Nachricht.";
    }
}

?>