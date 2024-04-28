document.addEventListener('DOMContentLoaded', function() {
    fetch('../info.json')
      .then(response => response.json())
      .then(data => {
        
        const articlesContainer = document.getElementById('articles-list');
        
        if (articlesContainer){
        
          const sortedArticles = data.articles.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

          if (data.articles.length > 0) {
            data.articles.forEach(article => {
              articlesContainer.innerHTML += `
                <li>
                  <div class="card feature-card">
                    <figure class="card-banner img-holder" style="--width: 1602; --height: 903;">
                      <img src="${article.image}" width="1602" height="903" loading="lazy" alt="${article.title}" class="img-cover">
                    </figure>
                    <div class="card-content">
                      <div class="wrapper">
                        <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                        <span>${article.readTime} minutos</span>
                      </div>
                      <h3 class="headline headline-3">
                        <a href="${article.link}" class="card-title hover-2">${article.title}</a>
                      </h3>
                      <a href="${article.link}" class="card-btn">Leer artículo</a>
                    </div>
                  </div>
                </li>
              `;
            });
          } else {
            articlesContainer.innerHTML = '<p>No hay ningún artículo aún.</p>';
          }
        }
      })
      .catch(error => console.error('Error loading the articles:', error));
  });