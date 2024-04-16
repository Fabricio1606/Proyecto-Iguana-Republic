let total = $("#total").val();
let idCart = $("#cartId").val();
let comment = $("#instructions").val();

$(document).ready(function() {
    $(document).on("click", "#place", function(e) {
        $.post("http://localhost:3000/cart/checkout/orders", {
           "idCart": idCart,
           "comment": comment,
           "total": total 
        }, function(data) {
            // Aqui pon el codigo para llevar al usuario a la parte de Paypal
            // Puedes usar algo tipo window.location.href = "URL"
            
        });
    });
});