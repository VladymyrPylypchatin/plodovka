<?php
    $data = json_decode($_POST["data"]);
    if (!empty($data->email) && !empty($data->phone)) {

        $name = (!empty($data->name) && isset($data->name)) ? $data->name : "No name";
        $email = (!empty($data->email) && isset($data->email)) ? $data->email : "No email";
        $phone = (!empty($data->phone) && isset($data->phone)) ? $data->phone : "No phone";
        
        mail("zhivovsad1962@gmail.com", "Заявка на саженцы PlodovkaOpt", "Имя: " . $name . "; E-mail - " . $email . "; Телефон - " . $phone);
        mail("plodovkaopt@gmail.com", "Заявка на саженцы PlodovkaOpt", "Имя: " . $name . "; E-mail - " . $email . "; Телефон - " . $phone);
        
        $host = 'a213547.mysql.mchost.ru'; // адрес сервера 
        $database = 'a213547_plodovka'; // имя базы данных
        $user = 'a213547_plodovka'; // имя пользователя
        $password = 'qwe321qwe'; // пароль

        $db = mysqli_connect($host, $user, $password, $database); 
        mysqli_set_charset($db, 'utf8');
        $query = "INSERT INTO lead (name, email, phone) VALUES ('".$name."', '".$email."', '".$phone."')";
        $result = mysqli_query($db, $query) or die("Ошибка " . mysqli_error($db));
        mysqli_close($db);

        echo 1;
   
        
    } else {
        echo 2;
    }