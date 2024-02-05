function create(url, data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
    const apellido1 = document.getElementById('apellido1').value;
    const apellido2 = document.getElementById('apellido2').value;
    const cedula = document.getElementById('cedula').value;
    const fecha = document.getElementById('fechaNacimiento').value;
    const genero = document.getElementById('genero').value;
    const estado = document.getElementById('estado').value;
    
    
    if (!nombre || !apellido1 || !apellido2 || !cedula || !fecha || !genero || !estado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    let partes = fecha.split('-');
    let fecha_nacimiento = `${partes[2]}-${partes[1]}-${partes[0]}`;
    
    const persona = { nombre, apellido1, apellido2, cedula, fecha_nacimiento, genero, estado };

    try {
        await create(personas_url, persona);
        alert('Agregado con éxito');
        limpiarFormulario();
        await actualizarLista();
        llenarSelect();
        console.log(persona.fecha);
    } catch (error) {
        console.error('Error al agregar persona:', error);
        alert('Error al agregar persona. Consulta la consola para más detalles.');
    }
    
}



