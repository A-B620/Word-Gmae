const worddisplay = document.querySelector('.displayscreen');
const randombtn = document.querySelector('.randbtn');
const answersection = document.querySelector('.answersection');
const tries = document.querySelector('.tries');
const notifications=document.querySelector('.notifications');
const timer=document.querySelector('.timer');
const scoreSection=document.querySelector('.score');
const notificationSection2=document.querySelector(".NOTI2");
const reset=document.querySelector('.reset');
const triesChildren = document.querySelectorAll('.tries .child');

var word;
var word_length;
var random_word;
var useranswer='';
var score=0;
var time;
var worddisplayed=false;
var timerInterval;

function starttimer(){
    time=30;
    timerInterval=setInterval(()=>{
      time--; 
      timer.textContent = `0:${time < 10 ? '0' + time : time}`;
        if (time <= 0) {
            clearInterval(timerInterval);
            notificationssection('timeUp');
        }
    },1000);
     
  };
  function timerReset(){
    clearInterval(timerInterval);
    timer.textContent = '0:30';
  };
 function pausetime(){
    clearInterval(timerInterval);
    timer.textContent=`0:${time < 10 ? '0' + time :time }`;
 };

 function correctPuzzleSFX(){
    var correctSFX=new Audio('./assets/audio/game-bonus-144751.mp3');
    correctSFX.play();
    setTimeout(() => {
       correctSFX.pause();
    }, 2000);
   };
   function GameOverSFX(){
       var GameOverSound=new Audio('./assets/audio/negative.mp3');
       GameOverSound.play();
       setTimeout(() => {
           GameOverSound.pause();
       }, 3000);
   };


 function notificationssection(type){
    if(type >= 0){
        const correctAnswerElement = document.querySelector('p').style.display='none';
        scoreSection.textContent=`Score : ${score}`;
        notificationSection2.firstElementChild.textContent='+10';
        correctPuzzleSFX();
        setTimeout(() => {
            notificationSection2.style.display='none';
            console.log("noti");
        },2000);
        notificationSection2.style.display='flex'; 
    }
    if(type == 'gameOver'){
        notificationSection2.querySelector('h1').textContent = 'Game Over';
        preesedPlayAgain();
    }
    
    if(type == 'timeUp'){
    
        notificationSection2.firstElementChild.textContent=`Time's Up`;
        preesedPlayAgain();
        
    }
    pausetime();
    
    };
function answerbracket(word, word_length) {
    console.log('created input slots');
    for (let count = 0; count < word_length; count++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '1';
        input.pattern = '[A-Za-z]';
        input.classList.add(`answer${count + 1}`, 'bg-transparent', 'h-[40px]', 'w-[40px]', 'rounded-md', 'outline-none', 'border-2', 'border-[#4A5567]', 'text-white', 'text-center', 'hover:border-[#672171]', 'focus:border-[#672171]');
        answersection.appendChild(input);
        answersection.children[0].focus();
        answersection.style.animation='none';
        // Add event listener for user input
        input.addEventListener('input', function() {
            handleUserInput(input, count);
        });
    }
}

function initialize() {
    answersection.innerHTML = '';

   
   
  
    timerReset();
}

function correctanswer(){
        
        console.log("user answer is correct");
        console.log("user entered word",useranswer);
        useranswer='';
        score += 10;
        console.log('loading next puzzle');
        console.log('user answer after correct answer = ',useranswer);
        notificationssection(score);
      
        pausetime();
        displayWord();

  
};
// Function to add Tailwind CSS animation classes
function addTailwindAnimation(element, animationClasses) {
    element.classList.add(...animationClasses);
    answersection.innerHTML='';};

// Function to remove Tailwind CSS animation classes
function removeTailwindAnimation(element, animationClasses) {
    element.classList.remove(...animationClasses);
   
    
};

 function displayWord() {
    worddisplay.textContent='Loading...';
    worddisplay.style.fontSize='20px';
  
    const animationClasses = ['animate-pulse', 'duration-500', 'ease-in-out'];
    addTailwindAnimation(worddisplay, animationClasses);
    worddisplay.classList.add(animationClasses);
     fetch('https://api.api-ninjas.com/v1/randomword', { headers: { 'X-Api-Key': 'oZrQOAihVHCBwTHe0N9Srg==1AVpteDot8dqK9Wv' } })
        .then(response => response.json())
        .then(result => {
            if (String(result.word).length < 6) {
                console.log(result);
                var letter_position = [];
                var scramble_word = '';
                random_word = String(result.word);
                word_length = random_word.length;
                console.log(random_word);
                console.log('length of word =', word_length);

                for (var count = 0; count <= word_length - 1; count++) {
                    var scramble = false;
                    console.log('count value =', count);

                    while (!scramble) {
                        var position = Math.floor(Math.random() * word_length);
                        if (letter_position.indexOf(position) !== -1) {
                            console.log('Generated position does not exist in array:', position);
                            scramble = false;
                        } else {
                            letter_position.push(position);
                            console.log('letter pushed', random_word.charAt(position));
                            scramble_word += random_word.charAt(position);
                            scramble = true;
                        }
                        console.log('the word after scrambling = ', scramble_word);
                        console.log('the array =', letter_position);
                       

                    }
                }
                
                console.log(letter_position);
                removeTailwindAnimation(worddisplay, animationClasses);
                worddisplay.style.fontSize='32px';
                worddisplay.textContent = scramble_word.toLowerCase();
                word = scramble_word;
                console.log(word);
                initialize();
                answerbracket(word, word_length);
                starttimer();
            } else {
                displayWord();
            };
          
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

randombtn.addEventListener('click', function () { // Random Button Functionality
    displayWord();
    console.log("clicked random btn");
});




var count = 0;
function handleUserInput(input, index) {
    const userInput = input.value.toLowerCase(); // Convert to lowercase for comparison
    console.log(`User input at position ${index}: ${userInput}`);
    if (userInput == ''){
        console.log('backspace/spacebar entered')
        return;
    }
    else{
        if (userInput === random_word.charAt(index).toLowerCase()) {
            input.style.border = '2px solid green';
            useranswer =useranswer+userInput;
            console.log('user answer after function handleuserinput = ',useranswer);
            if (useranswer.length == random_word.length && useranswer.slice(0,random_word.length) == random_word.toLowerCase()) {
                console.log('user answer after slicing = ',useranswer.slice(0,random_word.length));
                correctanswer();
                
            }
            if (index + 1 < answersection.children.length) {
                 answersection.children[index + 1].focus();
            };
            
            
        }
        else {
            count++;
            triescounter(count);
            mistakes(input.value);
        };
    };
   
};

function triescounter(count) {
    const mistakescounter=document.querySelector('.counter')
    if (count <= triesChildren.length) {
        triesChildren[triesChildren.length - count].style.background = '#4A5567';
        mistakescounter.innerHTML=`Tries(${triesChildren.length-count}/5)`;
    };
    if(count >= triesChildren.length){
        console.log('0 tries left ');
        notificationssection('gameOver');
    };
};


function mistakes(letter){
    const mistakesSection = document.querySelector('.mistakes');
    const mistakeItem = document.createElement('li');
    mistakeItem.textContent = letter;
    mistakesSection.append(mistakeItem);
};

function resetingValues(){
    count=0;

    const triesChildren = document.querySelectorAll('.tries .child');
    triesChildren.forEach(child =>{
        child.style.background='#7429C6'
    });
    const mistakescounter=document.querySelector('.counter');
    mistakescounter.textContent='Tries(5/5):';
    const mistakesSection = document.querySelector('.mistakes');
    mistakesSection.innerHTML='';
    var MistakesHeading=document.createElement('h1');
    MistakesHeading.innerHTML='Mistakes:';
    mistakesSection.appendChild(MistakesHeading);
    scoreSection.innerHTML='Score:0';
    timer.textContent='- :--';
    useranswer='';
}

function preesedPlayAgain(){
    console.log('play again ?');
    notificationSection2.style.display='flex';
    const correctAnswerElement = document.querySelector('p');
    correctAnswerElement.textContent = `Correct word : ${random_word}`;
    correctAnswerElement.style.display='flex';
    var BtnPlayAgain=document.createElement('button');
    BtnPlayAgain.textContent='play again';
    BtnPlayAgain.classList='playagain  p-1 w-[105px]  shadow-[-1px_-1px_1px_white] hover:scale-100 text-white shadow-[1px_1px_1px_#672171] rounded-lg bg-[#C951E7]';
    notificationSection2.appendChild(BtnPlayAgain);
    pausetime();
    const playagain=document.querySelector('.playagain');
    GameOverSFX();
    playagain.addEventListener('click',()=>{
        scoreSection.innerHTML='Score:0';
        notificationSection2.style.display='none';
        notificationSection2.lastChild.remove();
        resetingValues();
        displayWord();   
    });
};

reset.addEventListener('click',function resetBtn(){
    pausetime();
    resetingValues();
    displayWord();
});


window.onload = async function () {
    await displayWord();
  
};
