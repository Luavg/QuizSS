const respuestasCorrectas = {
    q1: "Mercurio",
    q2: "Marte",
    q3: "Júpiter",
    q4: "Venus",
    q5: "Vía Láctea",
    q6: "Hidrógeno",
    q7: "8",
    q8: "Saturno",
    q9: "La Luna",
    q10: "Estrella",
    q11: "Plutón",
    q12: ["Tierra", "Marte"], // checkbox
    q13: "tierra" // texto
};

// Variables para el cronometro
let tiempoSegundos = 300; // 5 min
let intervalo;

// Mostrar formulario e iniciar tiempo
document.getElementById('btn-empezar').addEventListener('click', () => {
    document.getElementById('inicio').classList.add('oculto');
    document.getElementById('contenedor-test').classList.remove('oculto');
    iniciarCronometro();
});

// Función para iniciar el cronómetro
function iniciarCronometro() {
    intervalo = setInterval(() => {
        tiempoSegundos--;
        let mins = Math.floor(tiempoSegundos / 60);
        let secs = tiempoSegundos % 60;
        document.getElementById('cuenta-atras').innerText = 
            `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (tiempoSegundos <= 0) {
            clearInterval(intervalo);
            corregirExamen(); // Bloqueo y corrección automática
        }
    }, 1000);
}

// 2. Escuchar el envío del formulario
document.getElementById('quiz-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Detiene el envío real ("post")
    corregirExamen();
});

function corregirExamen() {
    clearInterval(intervalo);
    const preguntas = document.querySelectorAll('.pregunta');
    let aciertos = 0;

    preguntas.forEach(contenedor => {
        // Obtenemos la respuesta correcta del HTML directamente
        const correcta = contenedor.getAttribute('data-answer');
        const feedback = contenedor.querySelector('.feedback');
        let esCorrecto = false;

        // 1. Buscamos qué tipo de input hay dentro
        const radioMarcado = contenedor.querySelector('input[type="radio"]:checked');
        const select = contenedor.querySelector('select');
        const checkboxes = contenedor.querySelectorAll('input[type="checkbox"]:checked');
        const inputTexto = contenedor.querySelector('input[type="text"]');

        // 2. Lógica de validación
        if (radioMarcado) {
            esCorrecto = radioMarcado.value === correcta;
        } 
        else if (select) {
            esCorrecto = select.value === correcta;
        }
        else if (checkboxes.length > 0) {
            const valores = Array.from(checkboxes).map(cb => cb.value);
            const correctasArray = correcta.split(',');
            esCorrecto = valores.length === correctasArray.length && 
                         valores.every(v => correctasArray.includes(v));
        }
        else if (inputTexto) {
            esCorrecto = inputTexto.value.toLowerCase().trim() === correcta.toLowerCase();
        }

        // 3. Aplicar cambios visuales
        if (esCorrecto) {
            aciertos++;
            contenedor.classList.add('correcta');
            feedback.innerText = "¡Correcto!";
        } else {
            contenedor.classList.add('incorrecta');
            feedback.innerText = `Incorrecto. Respuesta correcta: ${correcta}`;
        }

        // Bloquear para que no cambien la respuesta
        contenedor.querySelectorAll('input, select').forEach(el => el.disabled = true);
    });

    alert(`Examen finalizado. Puntuación: ${aciertos} / ${preguntas.length}`);
}