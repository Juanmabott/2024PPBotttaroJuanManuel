// Array de vehiculos (simulación de datos que ya existen)


let personaEditada = null; // Para saber si estamos editando o agregando



// Función para cargar los datos en la tabla con opción de filtro
function cargarTabla(filtro = 'todos') {
    const tbody = document.querySelector("#tabla-vehiculos tbody");
    const thead = document.querySelector("#tabla-vehiculos thead");

    // Verificar que tbody y thead existan
    if (!tbody || !thead) {
        console.error("El elemento tbody o thead no se encontró.");
        return; // Salir si no se encuentran los elementos
    }

    tbody.innerHTML = ""; // Limpiar la tabla

    // Limpiar encabezados existentes
    thead.innerHTML = "<tr></tr>"; // Reinicia los encabezados

    // Obtener la visibilidad de las columnas
    const columnasVisibles = Array.from(document.querySelectorAll("#column-visibility input:checked"))
                                  .map(input => input.value);

    // Crear encabezados según las columnas visibles
    columnasVisibles.forEach(columna => {
        const th = document.createElement("th");
        const botonOrdenar = document.createElement("button");
        botonOrdenar.textContent = capitalizeFirstLetter(columna);
        botonOrdenar.classList.add("ordenar");
        botonOrdenar.id = columna;

        // Listener para ordenar al hacer clic en el botón
        botonOrdenar.addEventListener('click', function () {
            ordenarPorPropivelMax(columna);
        });

        th.appendChild(botonOrdenar);
        thead.querySelector("tr").appendChild(th);
    });

    // Filtrar vehículos según el filtro seleccionado
    let vehiculosFiltrados = vehiculos; // Suponiendo que "vehiculos" es el array con todos los vehículos

    if (filtro === 'terrestre') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Terrestre);
    } else if (filtro === 'aereo') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Aereo);
    }

    // Cargar las filas en la tabla
    vehiculosFiltrados.forEach(vehiculo => {
        const fila = document.createElement("tr");

        // Crear celdas según las columnas visibles
        if (columnasVisibles.includes('id')) fila.appendChild(crearCelda(vehiculo.id));
        if (columnasVisibles.includes('modelo')) fila.appendChild(crearCelda(vehiculo.modelo));
        if (columnasVisibles.includes('AnioFab')) fila.appendChild(crearCelda(vehiculo.anoFab || '-'));
        if (columnasVisibles.includes('velMax')) fila.appendChild(crearCelda(vehiculo.velMax || '-'));
        
        if (columnasVisibles.includes('autonomia')) fila.appendChild(crearCelda(vehiculo.autonomia || '-'));
        if (columnasVisibles.includes('altMax')) fila.appendChild(crearCelda(vehiculo.altMax || '-'));
        
        if (columnasVisibles.includes('cantPue')) fila.appendChild(crearCelda(vehiculo.cantPue || '-'));
        if (columnasVisibles.includes('cantRue')) fila.appendChild(crearCelda(vehiculo.cantRue || '-'));

        // Agregar botón de eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("eliminar");
        btnEliminar.id = "eliminar";

        btnEliminar.addEventListener('click', () => eliminarVehiculo(vehiculo.id)); // Manejar el click para eliminar
        fila.appendChild(crearCelda(btnEliminar)); // Añadir botón a la fila

        // Doble clic para editar
        fila.addEventListener('dblclick', () => editarVehiculo(vehiculo));

        tbody.appendChild(fila);
    });
}


// Función para crear una celda
function crearCelda(contenido) {
    const celda = document.createElement("td");
    if (typeof contenido === 'object') {
        celda.appendChild(contenido); // Si es un botón, agrega el botón
    } else {
        celda.textContent = contenido; // Si es texto, agrega el texto
    }
    return celda;
}

// Función para capitalizar la primera letra de una palabra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para manejar el cambio de filtro
function manejarFiltro() {
    const filtro = document.getElementById('filtro').value;
    cargarTabla(filtro);
}
function manejarFiltroABM() {
    const filtro = document.getElementById('filtroABM').value;
    const aereoFields = document.getElementById('aereo-fields');
    const terrestreFields = document.getElementById('terrestre-fields');

    switch (filtro) {
        case 'todos':
            aereoFields.style.display = 'block';
            terrestreFields.style.display = 'block';
            break;
        case 'aereo':
            aereoFields.style.display = 'block';
            terrestreFields.style.display = 'none';
            break;
        case 'terrestre':
            aereoFields.style.display = 'none';
            terrestreFields.style.display = 'block';
            break;
    }
}


// Evento para actualizar la tabla al cambiar la visibilidad de las columnas
document.querySelectorAll("#column-visibility input").forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        manejarFiltro(); // Recargar la tabla cuando cambie la selección de columnas
    });
});
let ordenAscendente = true; // Controla si se ordena de forma ascendente o descendente

// Función para ordenar por propivelMax
function ordenarPorPropivelMax(propivelMax) {
    // Detectar si la propivelMax es numérica para ordenar siempre de menor a mayor
    const esNumerico = typeof vehiculos[0][propivelMax] === 'number';
    ordenAscendente = !ordenAscendente;

    // Ordenar directamente el array vehiculos
    vehiculos.sort((a, b) => {
        if (a[propivelMax] > b[propivelMax]) return esNumerico ? 1 : (ordenAscendente ? 1 : -1);
        if (a[propivelMax] < b[propivelMax]) return esNumerico ? -1 : (ordenAscendente ? -1 : 1);
        return 0;
    });

    cargarTabla(); // Recargar la tabla después de ordenar
}

document.addEventListener("DOMContentLoaded", function() {
    // Crear tabla y cargar datos
    cargarTabla();

    // Agregar eventos a los botones de ordenación
    document.querySelectorAll('.ordenar').forEach(boton => {
        boton.addEventListener('click', function() {
            const propivelMax = this.id; // Obtener la propivelMax del id del botón
            ordenarPorPropivelMax(propivelMax); // Llamar a la función de ordenación
        });
    });
});

// Función para mostrar el formulario ABM con datos de una persona
function editarVehiculo(vehiculo) {
    document.getElementById('form-datos').style.display = 'none';
    document.getElementById('form-abm').style.display = 'block';

    // Llenar los campos del formulario
    document.getElementById('idABM').value = vehiculo.id;
    document.getElementById('modeloABM').value = vehiculo.modelo;
    document.getElementById('anioFabABM').value = vehiculo.anoFab;
    document.getElementById('velMaxABM').value = vehiculo.velMax;

    // Limpiar los campos de altMax y autonomia
    document.getElementById('altMaxABM').value = '';
    document.getElementById('autonomiaABM').value = '';

    // Limpiar los campos de cantPue y cantRue
    document.getElementById('cantPueABM').value = '';
    document.getElementById('cantRueABM').value = '';

    // Ajustar la visibilidad de los campos dependiendo de la clase del vehículo
    if (vehiculo instanceof Terrestre) {
        document.getElementById('cantPueABM').value = vehiculo.cantPue || '';
        document.getElementById('cantRueABM').value = vehiculo.cantRue || '';
        document.getElementById('terrestre-fields').style.display = 'block';
        document.getElementById('aereo-fields').style.display = 'none';
    } else if (vehiculo instanceof Aereo) {
        document.getElementById('altMaxABM').value = vehiculo.altMax || '';
        document.getElementById('autonomiaABM').value = vehiculo.autonomia || '';
        document.getElementById('terrestre-fields').style.display = 'none';
        document.getElementById('aereo-fields').style.display = 'block';
    }

    personaEditada = vehiculo; // Guarda la persona que se está editando
}

// Función para guardar los datos de una nueva persona o actualizar una existente
function guardarPersona() {

    const id = document.getElementById('idABM').value; // ID es deshabilitado, no se debería capturar aquí
    const modelo = document.getElementById('modeloABM').value;
    const anioFab = document.getElementById('anioFabABM').value;
    const velMax = parseInt(document.getElementById('velMaxABM').value, 10);

    // Inicializar variables para los campos específicos
    let altMax = null;
    let cantPue = null;
    let cantRue = null;
    let autonomia = null;

    if (!modelo || !anioFab || isNaN(velMax)) {
        alert("Por favor completa todos los campos requeridos (modelo, año fab, Velocidad maxima).");
        return;
    }

    // Obtener los valores solo si están visibles
    if (document.getElementById('aereo-fields').style.display !== 'none') {
        altMax = document.getElementById('altMaxABM').value ? parseInt(document.getElementById('altMaxABM').value, 10) : null;
        autonomia = document.getElementById('autonomiaABM').value ? parseInt(document.getElementById('autonomiaABM').value, 10) : null; // Obtener autonomia solo si es aéreo
        if(!altMax || !autonomia)
        {
            alert("Por favor completa todos los campos requeridos (altmax, autonomia).");
            return;
        }
    }

    if (document.getElementById('terrestre-fields').style.display !== 'none') {
        cantRue = document.getElementById('cantRueABM').value ? parseInt(document.getElementById('cantRueABM').value, 10) : null;
        cantPue = document.getElementById('cantPueABM').value ? parseInt(document.getElementById('cantPueABM').value, 10) : null;
        if(!cantRue || !cantPue)
            {
                alert("Por favor completa todos los campos requeridos (cantidad puertas, cantidad ruedas).");
                return;
            }
    }

    // Validaciones simples
    
    

    // Si estamos editando un vehículo existente
    if (personaEditada) {
        // Modificar los datos de la persona existente
        personaEditada.modelo = modelo;
        personaEditada.anioFab = anioFab;
        personaEditada.velMax = velMax;
        personaEditada.altMax = altMax;
        personaEditada.cantPue = cantPue;
        personaEditada.cantRue = cantRue;
    } else {
        // Agregar una nueva persona
        const nuevoId = generarNuevoId(); // Asegúrate que este genera un ID válido
        
        // Crear un nuevo objeto dependiendo de si es terrestre o aéreo
        const nuevaPersona = document.getElementById('aereo-fields').style.display !== 'none' ? 
            new Aereo(nuevoId, modelo, anioFab, velMax, altMax, autonomia) : 
            new Terrestre(nuevoId, modelo, anioFab, velMax, cantPue, cantRue); // altMax se pasa como null si es terrestre

        vehiculos.push(nuevaPersona); // Asegúrate de que 'vehiculos' sea un array inicializado
    }

    // Recargar la tabla y ocultar el formulario ABM
    cargarTabla();
    cancelarEdicion();
}


function eliminarVehiculo(id) {
    // Buscar el índice de la persona a eliminar
    const index = vehiculos.findIndex(persona => persona.id === id);
    if (index > -1) {
        // Eliminar persona del array
        vehiculos.splice(index, 1);
        // Recargar la tabla después de la eliminación
        cargarTabla();
    } else {
        alert("Persona no encontrada.");
    }
}

// Función para generar un nuevo ID único
function generarNuevoId() {
    return vehiculos.length > 0 ? Math.max(...vehiculos.map(p => p.id)) + 1 : 1;
}

// Función para cancelar la edición o agregar una nueva persona
function cancelarEdicion() {
    personaEditada = null;
    document.getElementById('abm-form').reset();
    document.getElementById('form-abm').style.display = 'none';
    document.getElementById('form-datos').style.display = 'block';
}


// Función para agregar una nueva persona (limpia el formulario)
function agregarPersona() {
    document.getElementById('form-datos').style.display = 'none';
    document.getElementById('form-abm').style.display = 'block';
    document.getElementById('abm-form').reset();
    
    personaEditada = null;
}


// Función para calcular la velMax promedio de las vehiculos en la tabla
function calcularVelocidadMaximaPromedio() {
    const filtro = document.getElementById('filtro').value; // Función que debes implementar para obtener el filtro seleccionado
    let vehiculosFiltrados = vehiculos;

    // Filtrar vehículos según el filtro seleccionado
    if (filtro === 'terrestre') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Terrestre);
    } else if (filtro === 'aereo') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Aereo);
    }

    // Calcular la velocidad máxima promedio
    const velocidadMaximaPromedio = vehiculosFiltrados
        .map(vehiculo => vehiculo.velMax) // Extraer las velocidades máximas
        .reduce((suma, velocidad) => suma + velocidad, 0) / (vehiculosFiltrados.length || 1); // Calcular el promedio

    // Mostrar el resultado
    document.getElementById('velMax-promedio').innerText = `Velocidad maxima promedio: ${velocidadMaximaPromedio}`;
}
// botones desde js
document.getElementById('agregar').addEventListener('click', agregarPersona);

document.getElementById('guardar').addEventListener('click', (e) => {
    e.preventDefault();
    guardarPersona();
});
document.getElementById('cancelar').addEventListener('click', (e) => {
    e.preventDefault();
    cancelarEdicion();
});

document.getElementById('filtro').addEventListener('change', manejarFiltro);
document.getElementById('filtroABM').addEventListener('change', manejarFiltroABM);

document.getElementById("calcular").addEventListener("click", calcularVelocidadMaximaPromedio);



// Inicializar la tabla con los datos
document.addEventListener("DOMContentLoaded", function() {
    cargarTabla(); // Cargar la tabla con datos al iniciar
});