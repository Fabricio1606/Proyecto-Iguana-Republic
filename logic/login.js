let serverUrl = "http://localhost:3000/clients";

function submitForm() {
    var username = document.getElementById('nombre').value;
    var password = document.getElementById('clave').value;

    // Validar que los campos no estén vacíos
    if (!username || !password) {
        console.error('Por favor, ingrese tanto el nombre como la clave.');
        return;
    }

    if (username === "admin" && password === "123") {
        // Si el usuario es "admin" y la contraseña es "123"
        // Realizar la redirección según el valor de adminUser
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.user.adminUser) {
                    // Si adminUser es true, redirige a la página de indexadmin.ejs
                    window.location.href = 'indexadmin.ejs';
                } else {
                    // Si adminUser es false, redirige a la página de home.html
                    window.location.href = 'home.html';
                }
            } else {
                // La autenticación falló, muestra un mensaje de alerta
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Error en la autenticación. Por favor, inténtelo de nuevo.');
        });
    } else {
        // Si el usuario no es "admin" o la contraseña no es "123"
        alert("El usuario es 'admin' y la contraseña es '123'");
    }
}
