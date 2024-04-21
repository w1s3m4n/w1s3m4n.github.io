document.addEventListener('DOMContentLoaded', function() {
    
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop().split('.')[0];
  

    const markdownPath = `/articles/raw/${filename}.md`;
  
    fetch(markdownPath)
      .then(response => response.text())
      .then(markdown => {
        const renderer = new marked.Renderer()
        renderer.heading = function(text, level){
            if(level === 1){
                return `<h1 class="headline headline-1 section-title">
                <span class="span">${text}</span>
              </h1>`;
            } else if (level === 2){
                return `<h2 class="headline headline-2 section-title">
                <span class="span">${text}</span>
              </h2>`;
            }
            else{
                return `<h${level}>${text}</h${level}>`;
            }
        };
        renderer.image = function(href, title, text){
            return `<img src=${href} alt="${text}" class="w-100">`;
        };
        renderer.paragraph = function(text){
            return `<p class="section-text">${text}</p>`;
        };
        renderer.link = function(href, title, text){
            title = title ? `title="${title}"` : '';
            return `<a ${title} class="section-text-highlighed" href="${href}">${text}</a>`;
        };
        renderer.code = function(code, language){
            
            const validLang = hljs.getLanguage(language) ? language : 'plaintext';

            const highlighted = hljs.highlight(code, { language: validLang }).value;
            return `<pre class="block-code"><code class="hljs ${validLang}">${highlighted}</code></pre>`;
        };

        const htmlContent = marked.marked(markdown, {
          breaks: true,
          gfm: true,
          renderer: renderer,
          highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          }
        });
  
        const herocontainer = document.getElementById('article-container');
        herocontainer.innerHTML = htmlContent;
  
        const titleMatch = markdown.match(/^#\s(.+)/);
        if (titleMatch) {
          document.title = "Hackermate - " + titleMatch[1];
        }

        const articleContainer = document.getElementById('article-container');
        articleContainer.innerHTML = htmlContent;
  
        if (titleMatch) {
          document.title = "Hackermate - " + titleMatch[1];
        }

      })
      .catch(error => console.error('Error loading markdown file:', error));
  });
  