let triviaBtn = document.querySelector("#js-new-quote");
triviaBtn.addEventListener('click', newTriva);

const endpoint= "https://trivia.cyberwisp.com/getrandomchristmasquestion";

let answerBtn = document.querySelector("#js-tweet");
answerBtn.addEventListener('click', newAnswer);

let current = 
{
    question: "",
    answer: "",
}

async function newTriva()
{
    //console.log("Success");

    try
    {
        const response = await fetch(endpoint);

        if(!response.ok)
        {
            throw Error(response.statusText);
        }

        const json = await response.json();
        //console.log(json);
        displayTrivia(json["question"]);
        current.question = json["question"];
        current.answer = json["answer"];
        
        // Clear the answer when new trivia is generated
        const answerText = document.querySelector("#js-answer-text");
        answerText.textContent = "";
        
        console.log(current.question);
        console.log(current.answer);
    }

    catch(err)
    {
        console.log(err);
        alert("Failed to fetch new trivia question");
    }
}

function displayTrivia(question)
{
    const questionText = document.querySelector("#js-quote-text");
    questionText.textContent = question;
}

function newAnswer()
{
    //console.log("Answer button clicked");
    const answerText = document.querySelector("#js-answer-text");
    answerText.textContent = current.answer;
        
}