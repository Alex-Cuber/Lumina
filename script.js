let gamesData = [];

const gamesList = document.getElementById('gamesList');
const searchInput = document.getElementById('searchInput');
const mobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

async function loadIndexJson() {
    try {
        const response = await fetch(mobile ? 'indexMobile.json' : 'index.json');
        if (!response.ok) {
            throw new Error(`Error al cargar index.json: ${response.status}`);
        }
        gamesData = await response.json();
        renderGames(gamesData);
    } catch (error) {
        console.error("Error cargando el archivo de catálogo:", error);
        gamesList.innerHTML = '<div style="text-align:center; padding: 20px; color:#808080;">No se pudo cargar el archivo index.json.</div>';
    }
}

function renderGames(data) {
    gamesList.innerHTML = '';
    if (!data || data.length === 0) {
        gamesList.innerHTML = '<div style="text-align:center; padding: 20px; color:#808080;">No hay juegos disponibles.</div>';
        return;
    }

    data.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => openModal(game);

        card.innerHTML = `
            <img class="game-image" src="${game.image}" alt="${game.name}">
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-font">Fuente: ${game.font || 'Desconocida'}</div>
            </div>
            <a class="btn-download" href="${game.url}" target="_blank" onclick="event.stopPropagation()">Descargar</a>
        `;
        gamesList.appendChild(card);
    });
}

searchInput.addEventListener('input', (e) => {
    const text = e.target.value.toLowerCase().trim();
    const filtered = gamesData.filter(g => g.name.toLowerCase().includes(text));
    renderGames(filtered);
});

function openModal(game) {
    document.getElementById('modalImg').src = game.image;
    document.getElementById('modalTitle').textContent = game.name;
    document.getElementById('modalFont').textContent = `Fuente: ${game.font || 'Desconocida'}`;
    document.getElementById('modalDownloadBtn').href = game.url;

    const info = game.info || ["Sin descripción", "N/A", "N/A", "N/A", "N/A"];

    document.getElementById('modalDesc').innerHTML = `
        <b>Descripción:</b><br>${info[0]}<br><br>
        <b>Requisitos Mínimos:</b><br>
        - CPU: ${info[1]}<br>
        - GPU: ${info[2]}<br>
        - RAM: ${info[3]} GB<br>
        - Almacenamiento: ${info[4]}
    `;

    document.getElementById('gameModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

loadIndexJson();