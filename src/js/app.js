let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarAPP();
});

function iniciarAPP() {
    mostrarServicios();

    //Resalta div actual segun el tap al que se preciona
    mostrarSeccion();

    //Oculta o Muestra la seccion segun el tab al que se preciona
    cambiarSeccion();

    //Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validadicon
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //almacena la fecha de la cita en el objeto
    fechaCita();

    //desahabilita dias pasados
    deshabilitarFechaAnterior();
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    //Formato deseado: AAAA-MM-DD   
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;

}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDate();
        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no validos', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {

    //Si hay una alerta entonces no crear otra
    const alertaPrevia = document.querySelector('alerta');
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo == 'error') {
        alerta.classList.add('error');
    }

    //Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //validacion que nombreTexto debe tener algo
        if (nombreTexto == '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no Valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }

    });
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');


    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'faltan datos de Servicio, hora, fecha o nombre'

        noServicios.classList.add('invalidar-cita');

        //agregar a resumenDiv
        resumenDiv.appendChild(noServicios);
    }

    //Validacion de Objeto
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador()
    });
}

function mostrarSeccion() {


    //Eliminar mostrar-seccion de la seccion anterior

    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }


    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }


    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            //llamar la funcion de llamarSeccion;
            mostrarSeccion();
            botonesPaginador();
        });
    });
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

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(servicioObj);
    }

}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
}