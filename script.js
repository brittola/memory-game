//declaração de variáveis
let gameBoard = document.getElementById('gameBoard');
let outCount = document.getElementById('outCount');

let gameOver = document.getElementById('gameOver');
let btRestart = document.getElementById('btRestart');
let outScore = document.getElementById('outScore');
let outTopScore = document.getElementById('outTopScore');
let btClearScores = document.getElementById('btClearScores');

let cards;
let clickedCards; //array que será utilizado para checar par e que será resetado ao atingir length == 2
let flippedCards; //array que armazenará todas as cartas flipadas do tabuleiro para checar gameOver
let count;
let topScore;

const CARD = "card";
const FRONT = "card_front";
const BACK = "card_back";
const ICON = "icon";

let techs = [
    'bootstrap',
    'css',
    'electron',
    'firebase',
    'html',
    'javascript',
    'jquery',
    'mongo',
    'node',
    'react'
];

function startGame() {
    cards = createCardsFromTechs(techs); //cria as cartas com o array techs
    cards = cards.sort(() => Math.random() - 0.5); //reorganiza as cartas em posição aleatória

    renderCards(cards); //cria os elementos html das cartas e as adiciona ao gameBoard

    clickedCards = [];
    flippedCards = [];
    count = 0;

    outCount.textContent = count;
}

function renderCards(cards) {
    cards.forEach(card => {
        let cardElement = document.createElement('div');
        cardElement.id = card.id;
        cardElement.classList.add(CARD);
        cardElement.dataset.icon = card.icon;
        cardElement.addEventListener('click', flipCard);

        createCardContent(card, cardElement);

        gameBoard.appendChild(cardElement);
    });
}

function createCardContent(card, cardElement) {
    createCardFace(FRONT, card, cardElement);
    createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, cardElement) {
    let cardElementFace = document.createElement('div');
    cardElementFace.classList.add(face);

    if (face == FRONT) {
        let iconElement = document.createElement('img');
        iconElement.classList.add(ICON);
        iconElement.src = `./assets/${card.icon}.png`;
        cardElementFace.appendChild(iconElement);
    } else {
        cardElementFace.innerHTML = '&lt/&gt';
    }

    cardElement.appendChild(cardElementFace);
}

function createCardsFromTechs(techs) {
    cards = [];

    for (tech of techs) {
        cards.push(createPairFromTech(tech));
    }

    return cards.flatMap(pair => pair);
}

function createPairFromTech(tech) {
    return [{
        id: createIdWithTech(tech),
        icon: tech,
        flipped: false
    }, {
        id: createIdWithTech(tech),
        icon: tech,
        flipped: false
    }];
}

function createIdWithTech(tech) {
    return tech + Math.ceil(Math.random() * 1000);
}

//------------------- Created by Brittola ----------------------------

function flipCard() {
    this.classList.add('flip');
    clickedCards.push(this);

    if (clickedCards.length == 2) {
        if(clickedCards[0] == clickedCards[1]){ //se a mesma carta for selecionada, remove o segundo elemento do array e retorna
            clickedCards.pop();
            count--;
        }else{
            checkPair(clickedCards); //caso sejam duas cartas diferentes, checa par
            clickedCards = []; //reseta as cartas clicadas
        }
    }

    count++;
    outCount.textContent = count;
}

function checkPair(clickedCards) {
    if (clickedCards[0].dataset.icon == clickedCards[1].dataset.icon){ //se o icon da carta for o mesmo, mantém as cartas flipadas
            flippedCards.push(clickedCards[0]);
            flippedCards.push(clickedCards[1]);
    }else{
        setTimeout(() => { //caso sejam diferentes, espera meio segundo e então desvira a carta
            clickedCards[0].classList.remove('flip');
            clickedCards[1].classList.remove('flip');
        }, 500);
    }

    if(flippedCards.length == 20){ //caso as cartas flipadas sejam 20, encerra o jogo
        setTimeout(endGame, 500)
    }
}

function endGame(){
    gameOver.style.display = 'flex';
    btClearScores.style.display = 'block';
    outScore.textContent = count;

    if(localStorage.getItem('topScore')){
        topScore = Number(localStorage.getItem('topScore'));
    }else{
        localStorage.setItem('topScore', count);
    }

    if(topScore < count){
        outTopScore.textContent = 'Recorde atual: ' + topScore;
    }else{
        outTopScore.textContent = 'Recorde atual: ' + count;
        localStorage.setItem('topScore', count);
    }
}

function restartGame(){ //remove a tela de gameOver, apaga o tabuleiro e então chama o startGame que reconstrói tudo e reseta as variáveis
    gameOver.style.display = 'none';
    gameBoard.innerHTML = '';

    startGame();
}

btClearScores.addEventListener('click', () => {
    localStorage.removeItem('topScore');
    outTopScore.textContent = '';
    btClearScores.style.display = 'none';
});

btRestart.addEventListener('click', restartGame);

startGame();