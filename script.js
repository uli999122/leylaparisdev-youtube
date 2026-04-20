// Pantalla de carga
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const content = document.querySelector('.content');

  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      content.style.display = 'block';
    }, 800);
  }, 1500);
});

// Mostrar último video automáticamente (sin necesidad de API key)
const channelId = "TU_CHANNEL_ID_AQUÍ";   // ← Cambia esto

const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

fetch(rssUrl)
  .then(response => response.json())
  .then(data => {
    if (data.items && data.items.length > 0) {
      const latest = data.items[0];
      const videoId = latest.link.split('v=')[1];

      const container = document.getElementById('latest-video-container');
      container.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" 
                title="${latest.title}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <h3 style="margin-top: 20px; color:#ffb6c1;">${latest.title}</h3>
      `;
    }
  })
  .catch(err => {
    console.log("Error cargando video:", err);
    document.getElementById('latest-video-container').innerHTML = `<p style="color:#ff69b4;">¡Pronto subiremos un nuevo video!</p>`;
  });
