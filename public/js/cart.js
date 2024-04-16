$(document).ready(function(){
    let stock = 0;
    let prod = 0;
    let cart = 0;

    var subtotal = 0;

    $(document).on("focusin", ".quantity", function(e) {
        stock = $(this).val();
        prod = $(this).data("prod");
        cart = $(this).data("cart");
    });

    $(document).on("focusout", ".quantity", function(e) {
        if(stock != $(this).val()) {
            stock = $(this).val();

            $.post("http://localhost:3000/cart/amount", {
                "quantity" : stock,
                "idProd" : prod,
                "idCart" : cart
            }, function(data) {
                if(data.result == 1) {
                    location.reload();
                }
            });
        }
    });
});