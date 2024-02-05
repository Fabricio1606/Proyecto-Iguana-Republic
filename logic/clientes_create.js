function create(url, data, authCredentials = null) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authCredentials ? `Bearer ${authCredentials.token}` : '',
        },
        body: JSON.stringify(data),
    };

    // Realiza la solicitud POST a la API
    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`La solicitud no se pudo completar correctamente. Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta de la API:', data);
            return data;
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            throw error;
        });
}


async function agregarPersona() {
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const nacionalidad = document.getElementById('nacionalidad').value;
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    if (!nombre || !correo || !nacionalidad || !usuario || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const user = {
        nombre,
        correo,
        nacionalidad,
        usuario,
        password,
    };

    try {
        // Utiliza la función create para hacer la solicitud de registro
        await create('/register', user);
        alert('Registro exitoso');
        limpiarFormulario();  // Asegúrate de definir esta función si no está ya definida
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario. Consulta la consola para más detalles.');
    }
}



