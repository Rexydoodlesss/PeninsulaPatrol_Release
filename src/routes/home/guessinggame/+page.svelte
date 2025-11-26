<script>
    import { points } from '../../../stores.js';
    import { onMount } from 'svelte';
    import io from 'socket.io-client';
    let socket;
    let isOnline = true;
    let username;
    let listoftheteams = [359, 846, 1622, 2122, 2438, 3128, 3990, 4253, 4270, 4327, 4421, 4627, 4862, 5461, 5468, 5516, 6188, 6353, 6364, 6390, 6902, 7135, 7167, 7190, 7287, 7332, 7551, 7673, 7688, 7796, 8338, 8339, 8503, 9044, 9180, 9277, 9292, 9449, 9465, 9550, 9641, 9649, 9719, 10044, 10384, 10427, 10527]
     //let listoftheteams = [8, 114, 840, 841, 846, 1280, 1458, 1868, 2551, 3256, 3970, 4159, 4186, 4255, 4669, 4765, 4904, 4973, 5507, 5700, 5728, 5817, 5924, 5940,  6506, 6822, 7589, 7636, 7667, 8016, 8033, 8840, 8852, 8859, 9038, 10064, 10246, 10281, 10390, 10523]

    let listofwords = ["Hawaiian Kids", "The Funky Monkeys", "Team Spyder", "Team Tators", "'Iobotics", "The Aluminum Narwhals", "Tech for Kids", "Raid Zero", "Crusaders", "Q Branch", "FORGE Robotics", "Manning Robotics", "Manning Mountaineers", "Victorian Engineered Robotic Nation", "Chaos Theory", "Iron Maple", "Sting Robotics", "Zodiac", "Ten Ton Robotics", "Hephaestus", "STRIKE", "System Reset", "Spectrum ThunderBots", "Vancouver Rainstorms", "Esquimalt Atom Smashers", "Vancouver Puddle Jumpers", "Extreme Mechanism", "Formosan Sika", "Creekside Robotics", "Breaker Robotics", "Bear Force", "Penticton Robotics", "Raid One", "TeraViks", "GHS Robotics - Ursa Major", "Sparkans", "Zen Maker Robotics", "Yellowjackets", "Imagine High Axolotls", "STRIX Robotics", "Robotics71", "Mulgrave Robotics", "ThunderTech Robotics", "Panther Robotics", "Sparkans Sparkanovas", "Kitimat Sentinels", "5-Star"];
    // let listoftheteams = ["Paly Robotics", "Eaglestrike", "Aragon Robotics Team", "The BioMechs", "The Funky Monkeys", "Ragin' C-Biscuits", "Red Tie Robotics", "Space Cookies", "Penguin Empire", "WarriorBorgs", "Duncan Dynamics", "CardinalBotics", "Alameda Aztechs", "Robodores", "Galileo Robotics", "PWRUP", "Bot-Provoking", "Gator Gears", "Robotic Eagles", "SOTA Cyberdragons", "MC2", "Uni-Rex", "Golden Gate Robotics", "BREAD", "Steel Boot Robotics", "THE SHISHKABOTS", "Lishan Blue Magpie", "Robomania", "OtterBots", "Eco Robotics", "Highlander Robotics", "Bay Robotics", "Drew Robotics", "Bora Robotics", "SF UNITY", "HanniBAL", "INFINITECH", "MechaWolves", "GOOGIRL", "Singularity Robotics"];

    function updateOnlineStatus() {
      if (typeof navigator !== 'undefined') {
          isOnline = navigator.onLine;
      }
  }

    onMount(() =>
    {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
          isOnline = navigator.onLine;
          username = sessionStorage.getItem('username');
          window.addEventListener('online', updateOnlineStatus);
          window.addEventListener('offline', updateOnlineStatus);
      }
      socket = io('https://still-coast-90996-0172ad985f08.herokuapp.com/');
    socket.on('restart', () => {
      window.location.href = "/home";
      socket.emit("restartt", "");
    });
    })
  let op1 = 0;
    let op2 = 0;
    let op3 = 0;
    let correct = 0;
    let word = "";
    let lastone = "";
    let goingon = false;
    randomizeTeams()
    function randomizeTeams() {
        correct = Math.floor(Math.random() * 3) + 1;
        op1 = Math.floor(Math.random() * (listoftheteams.length - 2));
        do {
            op2 = Math.floor(Math.random() * (listoftheteams.length - 1));
        } while (op2 <= op1);
        do {
            op3 = Math.floor(Math.random() * listoftheteams.length);
        } while (op3 <= op2);

        if (correct === 1) {
            word = listofwords[op1];
        } else if (correct === 2) {
            word = listofwords[op2];
        } else {
            word = listofwords[op3];
        }
        if(lastone == word)
        {
            randomizeTeams()
        }
        else
        {
            lastone = word;
        }
    }
    function answer(selection)
    {
        if (!goingon){
        if (selection == correct)
        {
            goingon = true;
            const correctButton = document.getElementById(correct === 1 ? 'one' : correct === 2 ? 'two' : 'three');
            correctButton.style.backgroundColor = 'lightgreen';
            $points++;
            setTimeout(() => {
                correctButton.style.backgroundColor = 'lightgray';
                randomizeTeams();
                goingon = false;
            }, 500);
        }
        else
        {
            goingon = true;
            const wrongButton = document.getElementById(selection === 1 ? 'one' : selection === 2 ? 'two' : 'three');
            const correctButton = document.getElementById(correct === 1 ? 'one' : correct === 2 ? 'two' : 'three');
            wrongButton.style.backgroundColor = 'red';
            setTimeout(() =>{correctButton.style.backgroundColor = 'lightgreen';}, 2000)
            setTimeout(() => {
                wrongButton.style.backgroundColor = 'lightgray';
                correctButton.style.backgroundColor = 'lightgray';
                randomizeTeams();
                goingon = false;
            }, 5000);
        }
    }
    }
</script>
<div>
    <h1 style="color: #214D89">Guessing Game</h1>
    <p>Guess the team number based on the team name!</p>
</div>
<div>
    
    <h1>{word}</h1>
    <div style="background-color: gray;" class="grid grid-cols-3 grid-rows-1">
        <button id="one" on:click={() => answer(1)}>{listoftheteams[op1]}</button>
        <button id="two" on:click={() => answer(2)}>{listoftheteams[op2]}</button>
        <button id="three" on:click={() => answer(3)}>{listoftheteams[op3]}</button>
    </div>
</div>
<center>
<button style="background-color: lightgrey;" on:click={window.location.href = "/home"}>Return to Home</button>
</center>   
<p class="bottom-centered">literally why are you playing this</p>
<style>
    button
    {
        background-color: lightgray;
        padding: 0.5rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        margin: 0.5rem
    }
    .bottom-centered {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        width: 100%;
        margin: 0
    }
</style>