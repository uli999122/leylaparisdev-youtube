const channelId = "UC2at4aELEO_fqQ1yU43Ev4Q";
const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}&count=30`;

// === PEGA AQUÍ TU WEBHOOK DE DISCORD ===
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/https://discord.com/api/webhooks/1497340079570423899/91zIeMJzMNSNr2YBvh1q3taUO2FF86kfdCRDuUrTMLp__JFKfGGBN04N_-zuQQvFIsp0"; // ← Cambia esto

let allVideos = [];
let displayedCount = 12;

const motivationalPhrases = [
  "El rosa no es solo un color, es una actitud ✨",
  "Sé tú misma, el mundo ya tiene muchas copias 💖",
  "La belleza empieza cuando te aceptas tal como eres",
  "Hoy es un buen día para brillar más fuerte",
  "Tu energía rosa puede cambiar el mundo"
];

// Pantalla de carga
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 800);
  }, 1600);
});

// Cargar videos (mantengo funcional)
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
      <div class="thumbnail-container">
        <img src="https://img.youtube.com/vi/${vidId}/hqdefault.jpg" alt="${video.title}">
        <div class="play-overlay">▶</div>
      </div>
      <div class="video-info">
        <h3>${video.title}</h3>
        <p>${new Date(video.pubDate).toLocaleDateString('es-ES')}</p>
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

// Frase motivadora
function setRandomMotivation() {
  const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
  document.getElementById("motivationalPhrase").textContent = phrase;
}

// Encuesta con envío a Discord
document.getElementById("submitSurvey").addEventListener("click", async () => {
  const robloxName = document.getElementById("robloxName").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const country = document.getElementById("country").value;
  const phone = document.getElementById("phone").value.trim();
  const theme = document.getElementById("videoTheme").value;

  if (!robloxName || !age || !country || !phone) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (age < 12) {
    alert("Debes tener al menos 12 años para participar");
    return;
  }

  // Enviar a Discord
  const webhookData = {
    embeds: [{
      title: "Nueva Participación en Video 🎥",
      color: 0xff1493,
      fields: [
        { name: "Nombre en Roblox", value: robloxName },
        { name: "Edad", value: age.toString() },
        { name: "País", value: country },
        { name: "Teléfono/WhatsApp", value: phone },
        { name: "Tema deseado", value: theme || "No especificado" }
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

  // Confeti + notificación
  createConfetti();
  const notif = document.createElement("div");
  notif.style.cssText = "position:fixed;bottom:40px;left:50%;transform:translateX(-50%);background:linear-gradient(45deg,#ff1493,#ff69b4);color:white;padding:25px 55px;border-radius:30px;font-size:1.45rem;box-shadow:0 0 70px #ff1493;z-index:99999;";
  notif.innerHTML = `🎉 ¡Gracias ${robloxName}!<br>Tu participación ha sido enviada.<br>Leyla la leerá pronto 💖`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 8000);

  document.getElementById("surveyForm").reset();
});

function createConfetti() {
  for (let i = 0; i < 90; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.style.cssText = `position:fixed;top:-10px;left:${Math.random()*100}vw;width:12px;height:12px;border-radius:50%;background:${Math.random()>0.5 ? '#ff69b4' : '#ffb6c1'};z-index:99998;animation:fall ${Math.random()*4+3}s linear forwards;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 7000);
    }, i * 7);
  }
}

// Botón flotante
document.getElementById("floatBtn").onclick = () => {
  document.querySelector(".survey").scrollIntoView({ behavior: "smooth" });
};

// Inicializar
loadVideos();
setRandomMotivation();
setInterval(setRandomMotivation, 25000);
