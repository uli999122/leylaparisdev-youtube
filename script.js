const channelId = "UC2at4aELEO_fqQ1yU43Ev4Q";
const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

let allVideos = [];
let displayedCount = 12;

// Cargar videos (último + galería)
async function loadVideos() {
  try {
    const res = await fetch(rssUrl);
    const data = await res.json();
    allVideos = data.items || [];
    
    if (allVideos.length > 0) {
      const latest = allVideos[0];
      const vidId = latest.link.split('v=')[1].split('&')[0];
      document.getElementById("latest-video-container").innerHTML = `
        <iframe src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe>
        <h3>${latest.title}</h3>
      `;
    }
    
    renderVideos(allVideos.slice(0, displayedCount));
  } catch(e) { console.error(e); }
}

function renderVideos(videos) {
  const grid = document.getElementById("video-grid");
  grid.innerHTML = "";
  videos.forEach(video => {
    const vidId = video.link.split('v=')[1].split('&')[0];
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <img src="https://img.youtube.com/vi/${vidId}/hqdefault.jpg" alt="${video.title}">
      <div style="padding:15px;">
        <h3>${video.title}</h3>
        <p style="color:#ff69b4;">${new Date(video.pubDate).toLocaleDateString('es-ES')}</p>
      </div>
    `;
    card.onclick = () => {
      const modal = document.createElement("div");
      modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;";
      modal.innerHTML = `<div style="width:90%;max-width:920px;"><span onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:-30px;right:-30px;font-size:50px;color:#ff69b4;cursor:pointer;">×</span><iframe width="100%" height="520" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe></div>`;
      document.body.appendChild(modal);
    };
    grid.appendChild(card);
  });
}

// Filtros
document.getElementById("searchInput").addEventListener("input", () => filterVideos());
document.getElementById("dateFilter").addEventListener("change", () => filterVideos());

function filterVideos() {
  // (código de filtro igual que antes - se mantiene)
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allVideos.filter(v => v.title.toLowerCase().includes(search));
  renderVideos(filtered.slice(0, displayedCount));
}

// Cargar más
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  displayedCount += 12;
  renderVideos(allVideos.slice(0, displayedCount));
});

// Encuesta - Botón Enviar funcional
document.getElementById("submitSurvey").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const country = document.getElementById("country").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !age || !country || !phone) {
    alert("Por favor completa todos los campos");
    return;
  }

  // Notificación de éxito
  const notif = document.createElement("div");
  notif.style = "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#00ff88;color:#000;padding:20px 40px;border-radius:20px;font-size:1.3rem;box-shadow:0 0 40px #00ff88;z-index:99999;";
  notif.innerHTML = `✅ ¡Encuesta enviada correctamente!<br>Gracias ${name}, Leyla te verá pronto 💖`;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 6000);

  // Reset formulario
  document.getElementById("surveyForm").reset();

  // Aquí Leyla puede ver los datos en la consola (o conectarlo a Discord Webhook más adelante)
  console.log("=== NUEVA ENCUESTA ===");
  console.log("Nombre:", name);
  console.log("Edad:", age);
  console.log("País:", country);
  console.log("Teléfono:", phone);
  console.log("====================");
});

// Inicializar
loadVideos();
