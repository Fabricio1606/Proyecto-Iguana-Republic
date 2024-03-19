$(document).ready(function() {
    $(document).on("click", "#modifyproduct", function(e) {
        if(!ValidarModificacion()) {
            e.preventDefault();
        }  else {
            const portada = document.getElementById("input-file");
            e.preventDefault();

            if(portada.files[0] === undefined) {
                $.post("http://localhost:3000/dashboard/products/modify", {
                    "idProd": $("#idProd").val(),
                    "nameProd": $("#nameProd").val(),
                    "priceProd": $("#priceProd").val(),
                    "stockProd": $("#stockProd").val(),
                    "shortDescProd": $("#shortDescProd").val(),
                    "descProd": $("#descProd").val(),
                    "cateProd": $("#cateProd").val()
                }, function() {
                    e.preventDefault();
                    console.log("Listo")
                });
            } else {
                $.post("http://localhost:3000/dashboard/products/modify/1", {
                    "idProd": $("#idProd").val(),
                    "nameProd": $("#nameProd").val(),
                    "priceProd": $("#priceProd").val(),
                    "stockProd": $("#stockProd").val(),
                    "shortDescProd": $("#shortDescProd").val(),
                    "descProd": $("#descProd").val(),
                    "cateProd": $("#cateProd").val(),
                    "imgProd": portada.files[0].name
                }, function() {
                    e.preventDefault();
                    console.log("Listo")
                });
            }

        }
    })

    function ValidarProducto() {
        const name = $("#nameProd").val();
        const price = $("#priceProd").val();
        const stock = $("#stockProd").val();
        const short = $("#shortProd").val();
        const desc = $("#descProd").val();
        const category = $("#cateProd").val();

        const portada = document.getElementById("input-file");
        if(portada.files[0] === undefined) {
            return false;
        }

        const product = {
            name : name,
            price : price,
            stock : stock,
            short : short,
            desc : desc,
            category : category,
            portada : portada.files[0].name
        }

        console.log(product)

        return true;
    }

    

    function ValidarModificacion() {
        const name = $("#nameProd").val();
        const price = $("#priceProd").val();
        const stock = $("#stockProd").val();
        const short = $("#shortProd").val();
        const desc = $("#descProd").val();
        const category = $("#cateProd").val();

        const product = {
            name : name,
            price : price,
            stock : stock,
            short : short,
            desc : desc,
            category : category
        }

        console.log(product)

        return true;
    }
});