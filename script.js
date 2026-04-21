// Configuración
const channelId = "UC2at4aELEO_fqQ1yU43Ev4Q";
const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

let allVideos = [];
let displayedCount = 12;

// Cargar suscriptores (aproximado vía RSS + fallback)
async function loadSubscribers() {
  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const data = await res.json();
    // RSS no da subs exactos, mostramos placeholder bonito
    document.getElementById("subscribers").textContent = "Cargando...";
    // En producción puedes usar YouTube API con key, aquí simulamos
    setTimeout(() => {
      document.getElementById("subscribers").textContent = "12.4K";
    }, 1200);
  } catch(e) {
    document.getElementById("subscribers").textContent = "12.4K";
  }
}

// Cargar videos
async function loadVideos() {
  try {
    const res = await fetch(rssUrl);
    const data = await res.json();
    allVideos = data.items || [];
    
    renderVideos(allVideos.slice(0, displayedCount));
    document.getElementById("loadMoreBtn").style.display = allVideos.length > displayedCount ? "block" : "none";
    
    // Último video
    if (allVideos.length > 0) {
      const latest = allVideos[0];
      const videoId = latest.link.split('v=')[1].split('&')[0];
      document.getElementById("latest-video-container").innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        <h3>${latest.title}</h3>
      `;
    }
  } catch(e) {
    console.error(e);
  }
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
        <h3 style="font-size:1.1rem; margin-bottom:8px;">${video.title}</h3>
        <p style="color:#ff69b4;">${new Date(video.pubDate).toLocaleDateString('es-ES')}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:10000;";
      modal.innerHTML = `
        <div style="width:90%;max-width:900px;position:relative;">
          <span style="position:absolute;top:-20px;right:-20px;font-size:40px;cursor:pointer;color:#ff69b4;" onclick="this.parentElement.parentElement.remove()">×</span>
          <iframe width="100%" height="506" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe>
        </div>
      `;
      document.body.appendChild(modal);
    });
    grid.appendChild(card);
  });
}

// Filtros
document.getElementById("searchInput").addEventListener("input", filterVideos);
document.getElementById("dateFilter").addEventListener("change", filterVideos);

function filterVideos() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const days = parseInt(document.getElementById("dateFilter").value) || 9999;
  
  const filtered = allVideos.filter(video => {
    const titleMatch = video.title.toLowerCase().includes(search);
    const videoDate = new Date(video.pubDate);
    const diffDays = (Date.now() - videoDate.getTime()) / (1000*60*60*24);
    return titleMatch && diffDays <= days;
  });
  
  renderVideos(filtered.slice(0, displayedCount));
}

// Cargar más
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  displayedCount += 12;
  renderVideos(allVideos.slice(0, displayedCount));
});

// Encuesta
document.getElementById("submitSurvey").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const country = document.getElementById("country").value.trim();
  const phone = document.getElementById("phone").value.trim();
  
  if (!name || !age || !country || !phone) {
    alert("Por favor completa todos los campos");
    return;
  }
  
  // Aquí puedes enviar a Discord webhook o guardar en DataStore si es Roblox
  console.log("Encuesta enviada:", {name, age, country, phone});
  
  alert("¡Gracias por participar! Serás considerada para el video ✨");
  
  // Reset form
  document.getElementById("surveyForm").reset();
});

// Inicializar
loadSubscribers();
loadVideos();
