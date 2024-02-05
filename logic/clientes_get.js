const clientsUrl = 'http://localhost:3000/clients';  

function get(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos. Código de estado: ' + response.status);
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud:', error);
        throw error;
      });
}

function actualizarLista() {
    const clientsList = document.getElementById('clientsList');

    get(clientsUrl)
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Error: La respuesta no es un array de clientes');
            }

            // Limpiar la tabla
            clientsList.innerHTML = '';
            
            // Llenar la tabla con los datos de los clientes
            data.forEach(cliente => {
                const row = document.createElement('tr'); 
                row.innerHTML = `
                    <td>${cliente.idClient}</td>
                    <td>${cliente.nameClient}</td>
                    <td>${cliente.mailClient}</td>
                    <td>${cliente.nationClient}</td>
                    <td>${cliente.phoneClient}</td>
                    <td>${cliente.addressClient}</td>
                    <td>${cliente.userClient}</td>
                    <td>${cliente.passClient_hash}</td>
                `;
                clientsList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de clientes:', error.message);
            alert('Error al obtener la lista de clientes: ' + error.message);
        });
}

actualizarLista();