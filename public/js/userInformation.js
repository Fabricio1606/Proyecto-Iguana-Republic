//Fields of User information
let nameClient = $("#nameClient").val();
let userClient = $("#userClient").val();
let address = $("#addressClient").val();
let phone = $("#phoneClient").val();
let mail = $("#mailClient").val();
let nation = $("#nationClient").val();

$(document).ready(function() {
    $(document).on("click", "#updateUser", function(e) {
        e.preventDefault();

        if(ValidarInformacion()) {
            $.post("http://localhost:3000/profile/information", {
                "nameClient" : nameClient,
                "userClient" : userClient,
                "addressClient" : address,
                "phoneClient" : phone,
                "mailClient" : mail,
                "nationClient" : nation
            }, function(data) {
                if(data.result == 1) {
                    location.reload();
                }
            })
        }
    });

    $(document).on("click", "#updatePassword", function(e) {
        e.preventDefault();
        if(ValidarInformacion()) {
            let oldPassword = $("#passwordClient").val();
            $.post("http://localhost:3000/profile/password", {
                "oldPass" : oldPassword,
                "newPass" : $("#newPassword").val()
            }, function(data) {
                console.log(data);
                if(data.result == 2) {
                    $("#alertWrong").prop("hidden", false);
                } else if(data.result == 1){
                    $("#alertSuccess").prop("hidden", false);
                }
            });
        }
    });

    $(document).on("focusout", "#passwordClient", function(e) {
        let oldPassword = $("#passwordClient").val();
        if(oldPassword.length === 0) {
            $("#alertOld").prop("hidden", false);
        } else {
            $("#alertOld").prop("hidden", true);
        }
    });

    $(document).on("focusout", "#newPassword", function(e) {
        if(ValidatePassword()) {
            $("#updatePassword").prop("disabled", false);
        }
    });

    $(document).on("focusout", "#repeatPassword", function(e) {
        let oldPassword = $("#passwordClient").val();
        if(ValidatePassword()) {
            $("#alertNew").prop("hidden", true);
            $("#alertOld").prop("hidden", true);
            $("#updatePassword").prop("disabled", false);
        } else if(oldPassword.length === 0) {
            $("#alertOld").prop("hidden", false);
        } else {
            $("#alertNew").prop("hidden", false);
        }
    });

    function ValidarInformacion() {
        if(nameClient != $("#nameClient").val()) {
            nameClient = $("#nameClient").val();
        }

        if(userClient != $("#userClient").val()) {
            userClient = $("#userClient").val();
        }

        if(address != $("#addressClient").val()) {
            address = $("#addressClient").val();
        }

        if(phone != $("#phoneClient").val()){
            phone = $("#phoneClient").val();
        }

        if(mail != $("#mailClient").val()) {
            mail = $("#mailClient").val();
        }

        if(nation != $("#nationClient").val()) {
            nation = $("#nationClient").val();
        }

        return true;
    }

    function ValidatePassword() {
        let newPassword = $("#newPassword").val();
        let repeatPassword = $("#repeatPassword").val();
        let oldPassword = $("#passwordClient").val();
        console.log(newPassword);
        console.log(repeatPassword);
        console.log(oldPassword);

        if(newPassword == repeatPassword && oldPassword.length > 0) {
            return true;
        } else {
            return false;
        }
    }
});