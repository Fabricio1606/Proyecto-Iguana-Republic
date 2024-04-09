const cartBtn = document.querySelector(".cart-button");
const plus = document.querySelector(".plus"),
minus = document.querySelector(".minus"),
num = document.querySelector(".num");
let a = 1;

$(document).ready(function() {
    $(document).on("click", ".cart-button", function(e) {
        cartBtn.classList.add("clicked");
        setTimeout(() => {
            cartBtn.classList.remove("clicked");
        }, 3000);
        
        $.post("http://localhost:3000/cart/add", {
            idProd : $("#idProd").val(),
            priceProd : $("#priceProd").val(),
            quantityProd: a
        }, function(data) {
            if(data.result == 0) {
                window.location.replace("http://localhost:3000/login");
            }
        });
    });

    plus.addEventListener("click", ()=>{
        var stock = $("#stockProd").val();
        if(a != stock) {
            a++;
            a = (a < 10) ? a : a;
            num.innerText = a;
        }
    });
    minus.addEventListener("click", ()=>{
      if(a > 1){
        a--;
        a = (a < 10) ? a : a;
        num.innerText = a;
      }
    });
})