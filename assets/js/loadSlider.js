document.addEventListener('DOMContentLoaded', function() {
    fetch('../articles/info.json')
      .then(response => response.json())
      .then(data => {
        
        const articlesContainer = document.getElementById('article-slider');
        const featuredContainer = document.getElementById('featured-article');

        const categoryCount = {};
        if (articlesContainer){
            // Fetch all categories, even if they don't have any article
            data.categories.forEach(category =>{
                categoryCount[category.name] = {
                    count: 0, 
                    image: category.image, 
                    displayName: category.displayName, 
                    link: category.link
                };
            });

            if (data.articles.length > 0) {
                data.articles.forEach(article => {
                    const category = article.category;

                    if (categoryCount[category]) {
                        categoryCount[category].count++;
                    } else {
                        categoryCount[category] = {
                            count: 1, 
                            displayName: "Coming soon...", 
                            image: "",
                            link: "#" 
                        };
                    }
                });
                
                Object.entries(categoryCount).forEach(([category, details]) => {

                    articlesContainer.innerHTML += `
                    <li class="slider-item">
                        <a href="${details.link}" class="slider-card">

                        <figure class="slider-banner img-holder" style="--width: 507; --height: 618;">
                            <img src="${details.image}" width="507" height="618" loading="lazy" alt="${category}"
                            class="img-cover">
                        </figure>

                        <div class="slider-content">
                            <span class="slider-title">${details.displayName}</span>
                            <p class="slider-subtitle">${details.count} artículos</p>
                        </div>
                        </a>
                    </li>
                    `;
                });
            }
        } else {
          articlesContainer.innerHTML = '<p>No hay ningún artículo aún.</p>';
        }

        if (featuredContainer && data.featured && data.featured.length > 0){

            const featuredInfo = data.featured[0];
            console.log(featuredInfo);
            fetch(featuredInfo.link)
                .then(response => response.text())
                .then(markDownText => {
                    /*const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = htmlText;
                    const textContainer = tempDiv.querySelector("#article-container");*/
                    const articleText = extractFirstMDChars(markDownText) + " ...";
                    featuredContainer.innerHTML += `
                    <li>
                    <div class="recent-post-card">

                        <figure class="card-banner img-holder" style="--width: 271; --height: 258;">
                        <img src="${featuredInfo.image}" width="271" height="258" loading="lazy"
                            alt="image" class="img-cover">
                        </figure>

                        <div class="card-content">

                        <a href="#" class="card-badge">Mi sugerencia</a>

                        <h3 class="headline headline-3 card-title">
                            <a href="#" class="link hover-2">${featuredInfo.title}</a>
                        </h3>

                        <p class="card-text">
                            ${articleText}
                        </p>

                        <div class="card-wrapper">
                            </div>

                            <div class="wrapper">
                            <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                            <span class="span">${featuredInfo.readTime} minutos de lectura</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </li>
                    `;
                })
                .catch(error => console.error('Error fetching HTML article:', error));
        } else{
            featuredContainer.innerHTML = '<p>No hay ningún artículo recomendado :)</p>'
        }
        return data;
      })
      .catch(error => console.error('Error loading the articles:', error));
  });

function extractFirstMDChars(markdownText) {
    // Encuentra el primer título de nivel 2
    const sectionRegex = /##\s+.*?\n([\s\S]+?)(\n##|$)/gs;
    let match = sectionRegex.exec(markdownText);
    let sectionText = match ? match[1] : '';

    // Elimina sintaxis de Markdown que no sea texto plano, como links e imágenes
    sectionText = sectionText
        .replace(/!\[.*?\]\(.*?\)/g, '')  // Elimina imágenes
        .replace(/\[.*?\]\(.*?\)/g, '')   // Elimina enlaces
        .replace(/(```.*?```|`.*?`)/gs, '')  // Elimina bloques de código y código inline
        .trim();

    // Extraer los primeros 100 caracteres del texto plano
    let plainText = sectionText.substring(0, 300);

    return plainText;
}