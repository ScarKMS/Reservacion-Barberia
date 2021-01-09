document.addEventListener('DOMContentLoaded', function() {
    iniciarAPP();
});

function iniciarAPP() {
    mostrarServicios();
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;

        //Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            /**DOM Scripting**/
            //Generar nombre de Servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar DIV Contenedor de servicio
            const servicioDIV = document.createElement('DIV');
            servicioDIV.classList.add('servicio');
            servicioDIV.dataset.idServicio = id;

            //Selecciona un servicio para la Cita
            servicioDIV.onclick = seleccionarServicio;

            //Inyectar precio y nombre a DIV
            servicioDIV.appendChild(nombreServicio);
            servicioDIV.appendChild(precioServicio);

            //Inyectar DIV al HTML
            document.querySelector('#servicios').appendChild(servicioDIV);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    //Forzar que el elemento a darle click sea el DIV
    if (e.target.tagName == 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }

}