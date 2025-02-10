document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script ratings.js cargado y ejecutándose...');

    const ele_stars = document.getElementsByClassName('stars'); // Selecciona todos los elementos de clase 'stars'

    for (const ele of ele_stars) {
        const productId = ele.dataset._id; // Obtiene el _id del dataset

        try {
            // Hacer fetch inicial para cargar el rating
            const response = await fetch(`/api/ratings/${productId}`);
            if (response.ok) {
                const data = await response.json();
                const rate = Math.round(data.rating.rate);
                const count = data.rating.count;

                // Generar estrellas iniciales
                ele.innerHTML = generateStars(rate, count, productId);
                addEventListeners(ele); // Añadir eventos a las estrellas
            } else {
                ele.innerHTML = 'Rating no disponible';
            }
        } catch (error) {
            console.error('Error al obtener el rating:', error);
            ele.innerHTML = 'Error al cargar rating';
        }
    }

    // Función para generar las estrellas
    function generateStars(rate, count, productId) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="fa fa-star ${i <= rate ? 'checked' : ''}" 
                          data-_id="${productId}" 
                          data-star="${i}"></span>`;
        }
        starsHTML += `<span> (${count} valoraciones)</span>`;
        return starsHTML;
    }

    // Añadir listeners a las estrellas
    function addEventListeners(ele) {
        for (const ele_hijo of ele.children) { // Iterar por las estrellas
            if (ele_hijo.classList.contains('fa-star')) { // Solo en elementos estrella
                ele_hijo.addEventListener('click', Vota);
            }
        }
    }

    // Función para manejar la votación
    async function Vota(evt) {
        const productId = evt.target.dataset._id; // Producto
        const star = evt.target.dataset.star; // Estrella seleccionada

        try {
            // Hacer fetch para enviar el rating
            const response = await fetch(`/api/ratings/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rate: parseInt(star) }),
            });

            if (response.ok) {
                const data = await response.json(); // Respuesta de la API
                const newRate = Math.round(data.producto.rating.rate);
                const newCount = data.producto.rating.count;

                // Actualizar las estrellas con la nueva información
                const ele = evt.target.parentNode; // Elemento padre que contiene las estrellas
                ele.innerHTML = generateStars(newRate, newCount, productId);
                addEventListeners(ele); // Volver a añadir los eventos
            } else {
                console.error('Error al actualizar rating:', response.status);
            }
        } catch (error) {
            console.error('Error en la solicitud PUT:', error);
        }
    }
});
