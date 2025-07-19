const API_URL = "http://localhost:8000/estudiantes";
const btn_guardar = document.getElementById("btn_guardar");
const btn_borrar_todo = document.getElementById("btn_borrar_todo");

// Función para mostrar los datos en la tabla
async function mostrarVehiculos() {
    const response = await fetch(API_URL);
    if (response.ok) {
        const data = await response.json();
        tabla.innerHTML = "";
        data.details.forEach(vehiculo => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${vehiculo.matricula}</td>
                <td>${vehiculo.nombre}</td>
                <td>${vehiculo.apellidos}</td>
                <td>${vehiculo.genero}</td>
                <td>${vehiculo.direccion}</td>
                <td>${vehiculo.telefono}</td>
            `;
            tabla.appendChild(fila);
        });
    }
}

async function cargarVehiculos() {
    const res = await fetch('http://localhost:3000/api/vehiculos');
    const datos = await res.json();
    const tabla = document.getElementById('tabla_estudiantes');
    tabla.innerHTML = '';
    datos.forEach(v => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${v.matricula}</td>
            <td>${v.nombre}</td>
            <td>${v.apellidos}</td>
            <td>${v.genero}</td>
            <td>${v.direccion}</td>
            <td>${v.telefono}</td>
        `;
        tabla.appendChild(fila);
    });
    // Mostrar último registro
    if (datos.length > 0) {
        const ultimo = datos[datos.length - 1];
        document.getElementById('datos_ultimo_registro').innerHTML = `
            <li><strong>Modelo:</strong> ${ultimo.matricula}</li>
            <li><strong>Número VIM:</strong> ${ultimo.nombre}</li>
            <li><strong>Año de Fabricación:</strong> ${ultimo.apellidos}</li>
            <li><strong>Tipo:</strong> ${ultimo.genero}</li>
            <li><strong>Nombre Propietario:</strong> ${ultimo.direccion}</li>
            <li><strong>Teléfono:</strong> ${ultimo.telefono}</li>
        `;
        document.getElementById('ultimo_registro').style.display = 'block';
    }
}

// Evento para guardar y actualizar la tabla
btn_guardar.onclick = async (event) => {
    event.preventDefault();

    // Borra todos los registros anteriores
    await fetch(API_URL, { method: "DELETE" });

    // Guarda el nuevo registro
    const estudiante = {
        matricula: document.getElementById("matricula").value,
        nombre: document.getElementById("nombre").value,
        apellidos: document.getElementById("apellidos").value,
        genero: document.getElementById("genero").value,
        direccion: document.getElementById("direccion").value,
        telefono: document.getElementById("telefono").value
    };
    await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(estudiante)
    });

    formulario.reset();
    mostrarVehiculos(); // Solo se mostrará el registro recién ingresado
}

// Evento para borrar todos los registros
btn_borrar_todo.onclick = async () => {
    await fetch(API_URL, { method: "DELETE" });
    mostrarVehiculos();
};

// Al cargar la página, muestra los datos existentes
window.onload = mostrarVehiculos;

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const tabla = document.getElementById('tabla_estudiantes');
    const ultimoRegistro = document.getElementById('ultimo_registro');
    const datosUltimoRegistro = document.getElementById('datos_ultimo_registro');

    // Mostrar vehículos al cargar
    fetch('http://localhost:3000/api/vehiculos')
        .then(res => res.json())
        .then(data => {
            tabla.innerHTML = '';
            data.forEach(v => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${v.modelo}</td>
                    <td>${v.vim}</td>
                    <td>${v.anio}</td>
                    <td>${v.tipo}</td>
                    <td>${v.propietario}</td>
                    <td>${v.telefono}</td>
                `;
                tabla.appendChild(fila);
            });
        });

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        const modelo = document.getElementById('matricula').value;
        const vim = document.getElementById('nombre').value;
        const anio = document.getElementById('apellidos').value;
        const tipo = document.getElementById('genero').value;
        const propietario = document.getElementById('direccion').value;
        const telefono = document.getElementById('telefono').value;

        fetch('http://localhost:3000/api/vehiculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modelo, vim, anio, tipo, propietario, telefono })
        })
        .then(res => res.json())
        .then(data => {
            // Actualizar tabla
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${modelo}</td>
                <td>${vim}</td>
                <td>${anio}</td>
                <td>${tipo}</td>
                <td>${propietario}</td>
                <td>${telefono}</td>
            `;
            tabla.appendChild(fila);

            // Mostrar último registro
            datosUltimoRegistro.innerHTML = `
                <li><strong>Modelo:</strong> ${modelo}</li>
                <li><strong>Número VIM:</strong> ${vim}</li>
                <li><strong>Año de Fabricación:</strong> ${anio}</li>
                <li><strong>Tipo:</strong> ${tipo}</li>
                <li><strong>Nombre Propietario:</strong> ${propietario}</li>
                <li><strong>Teléfono:</strong> ${telefono}</li>
            `;
            ultimoRegistro.style.display = 'block';

            formulario.reset();
        });
    });

    document.getElementById('btn_cancelar').addEventListener('click', () => {
        formulario.reset();
    });
});