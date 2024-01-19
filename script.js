const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//items array
const items = [
    { name: "anime", image: "images/anime.png"},
    { name: "castlecrush", image: "images/castlecrush.png"},
    { name: "cricket", image: "images/cricket.jpeg"},
    { name: "gamerboy", image: "images/gamerboy.jpeg"},
    { name: "kidfishing", image: "images/kidfishing.jpeg"},
    { name: "monkey", image: "images/monkey.jpeg"},
    { name: "ok", image: "images/ok.png"},
    { name: "playingboy", image: "images/playingboy.jpeg"},
    { name: "masha", image: "images/masha.jpeg"},
    { name: "panda", image: "images/panda.png"},
    { name: "shark", image: "images/shark.jpeg"},
    { name: "unicorn", image: "images/unicorn.png"},
    { name: "squid", image: "images/squid.jpg"},
    { name: "cat", image: "images/cat.jpg"},
    { name: "boy", image: "images/boy.jpg"},
    { name: "retro", image: "images/retro.jpeg"},
    
];

//initial time
let seconds = 0;
minutes = 0;
//initial moves and win count
let movesCount = 0,
winCount = 0;

//for timer
const timeGenerator = () => {
    seconds += 1;
    //minutes logic
    if (seconds >=60) {
        minutes += 1;
        seconds = 0;
    }
    //format time before displaying
let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};


//for calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//pick random objects from the items array
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...items];
    //initializes cardvalues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //Random object selection
    for (let i = 0; i< size; i++){
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /* 
            create cards
            before => front side (contains question mark)
            after => back side (contains actual image);
            data-card-values is a custom attribute which stores the names of the cards to match later
        */
       gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
       <div class="card-before">?</div>
       <div class="card-after">
       <img src="${cardValues[i].image}" class="image" /></div>
       </div>
       `;
    }
    //grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //if selected card is not matched yet then only run(ie .already matched card when clicked would be ignored)
            if (!card.classList.contains("matched")) {
                //flip the clicked card
                card.classList.add("flipped");
                //if it is the firstcard (!firstcard since firstcard is initially false)
                if (!firstCard) {
                    //so current card will become firstCard
                    firstCard = card;
                    //current cards value becomes firstCardValue
                    firstCardValue = card.getAttribute("data-card-value");
                } else{
                    //increment moves since user selected second card
                    movesCounter();
                    //secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        //if both cards match add matched class so thee cards wold beignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        //set firstCard to false since next card would be first now
                        firstCard = false;
                        //winCount increment as user found a correct match
                        winCount += 1;
                        //check if winCount == half of cardValues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML =`<h2>You Won</h2>
                            <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        //if the card don't match
                        //flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }    
                }
            }
            
        });

    });
};
//start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //controls and buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

//stop game
stopButton.addEventListener(
    "click",
    (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
    );
  
//Initialize values and func calls 
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};

