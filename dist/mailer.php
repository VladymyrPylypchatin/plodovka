<?php
    $data = json_decode($_POST["data"]);
    if (!empty($data->email) && !empty($data->phone)) {

        $name = (!empty($data->name) && isset($data->name)) ? $data->name : "No name";
        $email = (!empty($data->email) && isset($data->email)) ? $data->email : "No email";
        $phone = (!empty($data->phone) && isset($data->phone)) ? $data->phone : "No phone";
        
        mail("zhivovsad1962@gmail.com", "Заявка на саженцы PlodovkaOpt", "Имя: " . $name . "; E-mail - " . $email . "; Телефон - " . $phone);
        mail("plodovkaopt@gmail.com", "Заявка на саженцы PlodovkaOpt", "Имя: " . $name . "; E-mail - " . $email . "; Телефон - " . $phone);
        echo 1;
    } else {
        echo 2;
    }