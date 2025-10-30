const quoteBtn = document.querySelector("#js-new-quote");
const quoteText = document.querySelector("#js-quote-text");
const authorText = document.querySelector("#js-answer-text");
const showAnswerBtn = document.querySelector("#js-tweet");

const endpoint = "https://dummyjson.com/quotes/random";

let currentAuthor = "";

quoteBtn.addEventListener('click', getNewQuote);
showAnswerBtn.addEventListener('click', showAuthor);

async function getNewQuote() 
{
    quoteText.textContent = "Loading...";
    authorText.textContent = "";
    quoteBtn.disabled = true;

    try 
    {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw Error(response.statusText);
        }

        const data = await response.json();
        console.log(data);
        quoteText.textContent = `"${data.quote}"`;
        currentAuthor = data.author;
        authorText.textContent = ""; // Clear the author initially
        
    } 
    
    catch (err) 
    {
        console.log(err);
        quoteText.textContent = "Failed to fetch quote. Please try again.";
        authorText.textContent = "";
    } 
    
    finally 
    {
        quoteBtn.disabled = false;
    }
}

function showAuthor()
{
    if (currentAuthor) 
    {
        authorText.textContent = `— ${currentAuthor}`;
    } 
    
    else 
    {
        authorText.textContent = "Generate a quote first!";
    }
}