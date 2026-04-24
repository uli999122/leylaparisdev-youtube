// ====================== SCRIPT ACTUALIZADO - LeylaparisDev ======================
const channelId = "UC2at4aELEO_fqQ1yU43Ev4Q";
const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

// === CAMBIA ESTO CON TU WEBHOOK DE DISCORD ===
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId";   // ← Pega aquí tu webhook

let allVideos = [];
let displayedCount = 12;

// Pantalla de carga
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 800);
  }, 1400);
});

// Cargar videos
async function loadVideos() {
  try {
    const res = await fetch(rssUrl);
    const data = await res.json();
    allVideos = data.items || [];
    
    if (allVideos.length > 0) {
      const latest = allVideos[0];
      let vidId = latest.link.split('v=')[1]?.split('&')[0];
      if (!vidId && latest.link.includes('/shorts/')) vidId = latest.link.split('/shorts/')[1].split('?')[0];
      
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
    let vidId = video.link.split('v=')[1]?.split('&')[0];
    if (!vidId && video.link.includes('/shorts/')) vidId = video.link.split('/shorts/')[1].split('?')[0];
    
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <img src="https://img.youtube.com/vi/${vidId}/hqdefault.jpg" alt="${video.title}">
      <div style="padding:15px;">
        <h3>${video.title}</h3>
        <p style="color:#ff69b4;">${new Date(video.pubDate).toLocaleDateString('es-ES')}</p>
      </div>
    `;
    card.onclick = () => showVideoModal(vidId, video.title);
    grid.appendChild(card);
  });
}

function showVideoModal(vidId, title) {
  const modal = document.createElement("div");
  modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;z-index:9999;";
  modal.innerHTML = `
    <div style="width:90%;max-width:920px;position:relative;">
      <span onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:-40px;right:-40px;font-size:50px;color:#ff69b4;cursor:pointer;">×</span>
      <iframe width="100%" height="520" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe>
    </div>
  `;
  document.body.appendChild(modal);
}

// Filtros y cargar más
document.getElementById("searchInput").addEventListener("input", filterVideos);
document.getElementById("dateFilter").addEventListener("change", filterVideos);
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  displayedCount += 12;
  renderVideos(allVideos.slice(0, displayedCount));
});

function filterVideos() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allVideos.filter(v => v.title.toLowerCase().includes(search));
  renderVideos(filtered.slice(0, displayedCount));
}

// ====================== BOTÓN FLOTANTE + ENCUESTA ======================
const submitBtn = document.getElementById("submitSurvey");

submitBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const country = document.getElementById("country").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !age || !country || !phone) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (age < 12) {
    alert("Debes tener al menos 12 años para participar");
    return;
  }

  // Enviar a Discord Webhook
  const webhookData = {
    embeds: [{
      title: "Nueva Participación en Video 🎥",
      color: 0xff1493,
      fields: [
        { name: "Nombre", value: name, inline: true },
        { name: "Edad", value: age.toString(), inline: true },
        { name: "País", value: country, inline: true },
        { name: "Teléfono/WhatsApp", value: phone }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookData)
    });
  } catch(e) {
    console.error("Error enviando a Discord", e);
  }

  // Notificación bonita en pantalla
  const notif = document.createElement("div");
  notif.style.cssText = "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#00ff88;color:#000;padding:22px 50px;border-radius:25px;font-size:1.4rem;box-shadow:0 0 60px #00ff88;z-index:99999;text-align:center;";
  notif.innerHTML = `✅ ¡Participación enviada correctamente!<br>Leyla la leerá pronto 💖`;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 7000);

  document.getElementById("surveyForm").reset();
});

// Botón flotante para abrir encuesta
const floatBtn = document.createElement("button");
floatBtn.innerHTML = "📝 Participar";
floatBtn.style.cssText = `
  position:fixed; bottom:25px; right:25px; 
  background:linear-gradient(45deg,#ff1493,#ff69b4); 
  color:white; border:none; border-radius:50px; 
  padding:16px 24px; font-size:1.1rem; box-shadow:0 0 30px #ff1493;
  z-index:999; cursor:pointer; display:flex; align-items:center; gap:8px;
`;
floatBtn.onclick = () => {
  document.querySelector(".survey").scrollIntoView({ behavior: "smooth" });
};
document.body.appendChild(floatBtn);

// Inicializar
loadVideos();
