const API_KEY = '545a7c2a362e48019e1519a395295c86';

const categorySelect = document.getElementById('category-select');
const fetchBtn = document.getElementById('fetch-news');
const clearBtn = document.getElementById('clear-prefs');
const newsContainer = document.getElementById('news-container');
const savedPrefs = document.getElementById('saved-prefs');
const savedCategory = document.getElementById('saved-category');

//load teh saved preference on page load
window.addEventListener('load', loadSavedPreference);
fetchBtn.addEventListener('click', fetchNews);
clearBtn.addEventListener('click', clearPreferences);
categorySelect.addEventListener('change', savePreference);

function loadSavedPreference() 
{
    const saved = localStorage.getItem('newsCategory');
    if (saved)
    {
        categorySelect.value = saved;
        savedPrefs.style.display = 'block';
        savedCategory.textContent = saved.charAt(0).toUpperCase() + saved.slice(1);
    }
}

function savePreference() 
{
    const category = categorySelect.value;
    localStorage.setItem('newsCategory', category);
    savedPrefs.style.display = 'block';
    savedCategory.textContent = category.charAt(0).toUpperCase() + category.slice(1);
}

function clearPreferences() 
{
    localStorage.removeItem('newsCategory');
    savedPrefs.style.display = 'none';
    categorySelect.value = 'general';
    alert('Preferences cleared!');
}

async function fetchNews() 
{
    const category = categorySelect.value;
    newsContainer.innerHTML = '<div class="loading">Loading news...</div>';
    fetchBtn.disabled = true;

    try 
    {
        const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=5&apiKey=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) 
        {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.articles && data.articles.length > 0) 
        {
            displayNews(data.articles);
        } 
        
        else 
        {
            newsContainer.innerHTML = '<p class="error">No news articles found for this category.</p>';
        }

    } 
    
    catch (err) 
    {
        console.error(err);
        newsContainer.innerHTML = 
        `
        <div class="error">
        <strong>couldn't fetch the news :(.</strong><br>
        Too many requests and maybe an issue with the API...<br>
        </div>
        `;
    } 
    
    finally 
    {
        fetchBtn.disabled = false;
    }
}

function displayNews(articles) 
{
    newsContainer.innerHTML = '';
            
    articles.forEach(article => 
    {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'news-article';
                
        const title = article.title || 'No title';
        const description = article.description || 'No description available';
        const source = article.source.name || 'Unknown source';
        const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date';
        const url = article.url;

        articleDiv.innerHTML = 
        `
            <div class="news-title">${title}</div>
            <div class="news-description">${description}</div>
            <div class="news-meta">${source} • ${date}</div>
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="news-link">Read full article →</a>
        `;

        newsContainer.appendChild(articleDiv);
    });
}