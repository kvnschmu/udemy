document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const loadingIndicator = document.getElementById('loading');
    const updateTimeElement = document.getElementById('update-time');

    // Funktion zum Formatieren des Zeitstempels
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return `Zuletzt aktualisiert: ${date.toLocaleDateString('de-DE')} um ${date.toLocaleTimeString('de-DE')}`;
    }

    // Funktion zum Erstellen einer einzelnen Kurskarte
    function createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';

        // Ersetzt Platzhalter falls nötig
        const previewImg = course.preview_img.startsWith('http') ? course.preview_img : 'https://placehold.co/750x422/E9E8E8/E9E8E8/png';

        card.innerHTML = `
            <img src="${previewImg}" alt="${course.title}">
            <div class="card-content">
                <h2>${course.title}</h2>
                <div class="details">
                    <p class="author">Autor: ${course.author}</p>
                    <p>Kategorie: ${course.category} (${course.sub_category})</p>
                    <p>Bewertung: ${course.rating} (${course.reviews} Reviews)</p>
                    <p>Code: ${course.coupon_code}</p>
                    <p>Verbleibende Nutzungen: ${course.uses_remaining}</p>
                </div>
                <a href="${course.coupon_link}" target="_blank" class="card-button">Zum Kurs</a>
            </div>
        `;
        return card;
    }

    // Daten abrufen und rendern
    fetch('udemy_coupon.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerk-Antwort war nicht OK: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            loadingIndicator.style.display = 'none';

            // 1. Aktualisierungszeit anzeigen
            updateTimeElement.textContent = formatTime(data.update_time + ' +0000');

            // 2. Kurse rendern
            data.results.forEach(course => {
                const card = createCourseCard(course);
                courseList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Fehler beim Laden der Kurse:', error);
            loadingIndicator.textContent = `Fehler beim Laden der Daten: ${error.message}. Bitte versuchen Sie es später erneut.`;
            updateTimeElement.textContent = 'Daten konnten nicht geladen werden.';
        });
});