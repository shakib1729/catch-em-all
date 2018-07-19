  const holes = document.querySelectorAll('.hole');
  const scoreBoard = document.querySelector('.score');
  const moles = document.querySelectorAll('.mole');
  const cheat = document.querySelector('.cheat');  // for diaplaying 'Ash' for 3s when a cheat is typed
 
  const inputs = document.querySelectorAll('input'); // for disabling left side difficulty selector

  let highScore = JSON.parse(localStorage.getItem('scores')) || [0,0,0,0,0];
  const rl = document.querySelectorAll('.highScoreTable .radio-label');
    // console.log(rr);
  rl.forEach((e,i) => {
    e.textContent = highScore[i];
  });

  let difficulty=1;  // set default difficulty to 'amateur'

  let lastHole;
  let timeUp =false;
  let score = 0;
  let min = 500;
  let max = 1100;
  let gameTime = 10000; // run each round for 10s



  function randomTime(min, max){  // to get a random time for how long the mole pops up
    return Math.round(Math.random() * (max-min) + min);
  }


  function randomHole(holes,idx){  // to get a random DOM element from a NodeList of DOM elements(in our case 'moles')

    const hole = holes[idx]; // get the hole which is at position 'idx'

      if(hole === lastHole){  // we don't want the same hole twice
        const idx = Math.floor(Math.random()*holes.length);
        return randomHole(holes,idx);
      }


    lastHole = hole; // to save the reference to the hole which was used when last time this function was called , so we don't select the same hole again twice
    // to get the last refernce we need to return

    return hole;
  }


  function peep(){
    const time = randomTime(min, max); // b/w 0.2 and 1.1 seconds(default value for 'amateur') (for how many seconds the moles should be on the screen)
    const idx = Math.floor(Math.random()*holes.length);
    const hole = randomHole(holes,idx);
    const pokemon = Math.round(Math.random()*9);

    const mole = document.querySelector(`.mole${idx}`);
   
    mole.classList.add(`poke${pokemon}`);

     hole.classList.add('up');
     setTimeout(()=>{
       hole.classList.remove('up');
       mole.classList.remove(`poke${pokemon}`);
       if(!timeUp) peep();  // if time is not up , then run peep() again
     }, time);

  }

  function startGame(){ 
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;


  ////////////////////// for CHEAT CODES///////////////////////////////
  const pressed = [];
   const secretCode = 'iamacheater';
  window.addEventListener('keyup', e => {
    pressed.push(e.key);  // go to the last element , proceed backwards and remove the excess letters
    pressed.splice(-secretCode.length-1, pressed.length-secretCode.length); // to remove excess letters
    if(pressed.join('').includes(secretCode)){
     score=score+3;
     scoreBoard.textContent = score;
      if(score> highScore[difficulty]) {
          highScore[difficulty] = score;
          document.querySelector(`.s${difficulty}`).textContent = score;  
        }
     cheat.style.display = 'block';
    }
    setTimeout(()=> cheat.style.display = 'none', 3000);
  })
  //////////////////////////////////////////////////////////////////////////

    svgPieTimer({    
    element: [loader, border], // Element (Required) SVG sub element to animate. Accepts array. 
    duration: gameTime,   // Duration (Optional) In milliseconds. Defaults to 1000.
    loops: 1 // Loops (Optional) Defaults to 1. Set to 0 for infinite.

});

  peep();
  setTimeout(() => {
    timeUp = true; 
    localStorage.setItem('scores', JSON.stringify(highScore)); // when gameTime(10s) is over, add the score to the localStorage
  }, gameTime);  // run the game for 10s

  }

  function bonk(e,i){ // to add score
      if(!e.isTrusted) return; //Cheater , the click was from another source
       score++;
       holes[i].classList.remove('up');   // if the mole was clicked we want to remove the 'up' class from that particular hole even if the time is not finished
       scoreBoard.textContent = score;
        if(score> highScore[difficulty]) {
          highScore[difficulty] = score;
          document.querySelector(`.s${difficulty}`).textContent = score;  
        }
  }

 

  document.querySelector('.start').addEventListener('click',(e)=>{
    startGame();
    e.target.disabled = true;  
    inputs.forEach(e => e.disabled = true);  // disable the 'start' button and the 'difficulty' for gameTime(10s)
    setTimeout(() =>  {e.target.disabled = false; inputs.forEach(e => e.disabled = false);}, gameTime);    
  });

  
  moles.forEach((mole,i) => mole.addEventListener('click',e => bonk(e,i))); // add the score when a pokemon is clicked

  document.querySelector('.radio-box').addEventListener('click', e=> {   
     difficulty = parseInt(e.target.dataset.difficulty);
     switch(difficulty){
      case 0: min = 800;     //beginner
              max = 1500;
              break;
      case 1: min = 500;     //amateur(default)
              max = 1100;
              break;
      case 2: min = 300;     //semi pro
              max = 1000;
              break;
      case 3: min = 200;     //pro
              max = 900;
              break;
      case 4: min = 150;     //legendary
              max = 600;
              break;
     }    
  });

  document.querySelector('.rules').addEventListener('click',()=>{
     alert(`Gotta Catch 'Em All!!!
      Catch as many pokemons you can within ${gameTime/1000}s to reach at the top of the score table and become the king of the World!!! `);
   });

