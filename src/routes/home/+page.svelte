<script>
  import { onMount } from 'svelte';
  import { color, incap, teamKey, autoLeave, matchKey, autoL1Success, autoL1Failure, autoL2Success, autoL2Failure, autoL3Success, autoL3Failure, autoL4Success, autoL4Failure, teleL1Success, teleL1Failure, teleL2Success, teleL2Failure, teleL3Success, teleL3Failure, teleL4Success, teleL4Failure, autoAlgaeDescoreSuccess, autoAlgaeDescoreFailure, autoAlgaeNetSuccess, autoAlgaeNetFailure, autoAlgaeProcessorSuccess, autoAlgaeProcessorFailure, teleAlgaeDescoreSuccess, teleAlgaeDescoreFailure, teleAlgaeNetSuccess, teleAlgaeNetFailure, teleAlgaeProcessorSuccess, teleAlgaeProcessorFailure, defense, broke, notes, deepSuccess, deepFailure, shallowSuccess, shallowFailure, parkSuccess, parkFailure, superScoutingNotes, climbTime, penalties, defenseQuality, defended, pitscoutinglink, matchdatalink, eventkey } from '../../stores.js';
  import Toggle from '$lib/components/Toggle.svelte';
  import io from 'socket.io-client';
  let username = '';
  let message = "";
  let scouttype = 0;
  let isOnline = false;
  let queuing = false;
  let assign = 0;
  let datasheet = "";
  let pitscout = "";
  let socket;
  let goodnews='';
  
  onMount(() => {
    $color = ''; $incap=0; $teamKey = ''; $autoLeave = 0; $matchKey = ''; $autoL1Success = 0; $autoL1Failure = 0; $autoL2Success = 0; $autoL2Failure = 0; $autoL3Success = 0; $autoL3Failure = 0; $autoL4Success = 0; $autoL4Failure = 0; $teleL1Success = 0; $teleL1Failure = 0; $teleL2Success = 0; $teleL2Failure = 0; $teleL3Success = 0; $teleL3Failure = 0; $teleL4Success = 0; $teleL4Failure = 0; $autoAlgaeDescoreSuccess = 0; $autoAlgaeDescoreFailure = 0; $autoAlgaeNetSuccess = 0; $autoAlgaeNetFailure = 0; $autoAlgaeProcessorSuccess = 0; $autoAlgaeProcessorFailure = 0; $teleAlgaeDescoreSuccess = 0; $teleAlgaeDescoreFailure = 0; $teleAlgaeNetSuccess = 0; $teleAlgaeNetFailure = 0; $teleAlgaeProcessorSuccess = 0; $teleAlgaeProcessorFailure = 0; $defense = 0; $broke = 0; $notes = ''; $deepSuccess = 0; $deepFailure = 0; $shallowSuccess = 0; $shallowFailure = 0; $parkSuccess = 0; $parkFailure = 0; $superScoutingNotes = ''; $climbTime = 0; $penalties = 0; $defenseQuality = 1; $defended = 0;

      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
          isOnline = navigator.onLine;
          username = sessionStorage.getItem('username');
          window.addEventListener('online', updateOnlineStatus);
          window.addEventListener('offline', updateOnlineStatus);
      }
      socket = io('https://still-coast-90996-0172ad985f08.herokuapp.com/');

      socket.on('datasheet', (link) => {
      $matchdatalink = link;
    });

    socket.on('pitscout', (link) => {
      $pitscoutinglink = link;
    });

    socket.on('restart', (link) => {
      goodnews = "Queue Refreshed"
      message="";
    });

    socket.on('restartt', (link) => {
      goodnews = "Queue Refreshed"
      message="";
    });

    socket.on('eventkey', (key) => {
      $eventkey = key;
    });

    socket.on('emptymatch', (key) => {
      message="Match Queue Full"
      goodnews=""
      queuing = false;
    });

    socket.on('emptysuper', (key) => {
      message= "Super Queue Full"
      goodnews=""
      queuing = false;
    });

    socket.on('matchqueue', (data) => {
      $teamKey = data.team;
      $matchKey = data.matchkey;
      $color = data.color;
      window.location.href = "/match";
    });

    socket.on('superqueue', (data) => {
      $teamKey = data.team;
      $matchKey = data.matchkey;
      $color = data.color;
      window.location.href = "/super";
    });
    });

  function updateOnlineStatus() {
      if (typeof navigator !== 'undefined') {
          isOnline = navigator.onLine;
      }
  }

  function queue() {
      queuing = true;
      socket.emit('queue', {scouttype: scouttype, username: username});
  }

  function removequeue() {
      queuing = false;
  }

  function manual() {
    if (!$teamKey || !$matchKey) {
      message = "Please enter a Team and Match key";
      goodnews = "";

    }
    else{
      if (scouttype == 0) {
          window.location.href = `/match`;
      }
      else{
          window.location.href = `/super`;
      }  
    } 
  }
</script>
  
  <h1 style="margin-bottom: 0;">Welcome <span style="color: #214D89">{username}!</span></h1>
  <p>{isOnline ? 'You are online; lets get scouting!' : 'You are offline; QR code time!'}</p>
  {#if isOnline}
  <div class="grid grid-cols-2 grid-rows-3 gap-4" style="background-color: darkgray; margin-top: 2rem">
    <button on:click={() => window.open("https://www.thebluealliance.com/event/"+$eventkey)}>TBA Link</button>
    <button on:click={() => window.open($matchdatalink)}>Data Sheet</button>
    <button on:click={() => window.location.href = '/home/pastqr'}>Past QR Codes</button>
    <button on:click={() => window.location.href = '/home/scanqr'}>Scanner</button>
    <button on:click={() => window.open($pitscoutinglink)} class="col-span-1">Pit Scout</button>
    <button on:click={()=> window.location.href = "/home/guessinggame"}>Guess Teams</button>
  </div>
  {:else}
  <div class="grid grid-cols-2 grid-rows-1 gap-4" style="background-color: darkgray; margin-top: 2rem">
    <button on:click={() => window.location.href = '/home/pastqr'}>Past QR Codes</button>
    <button on:click={()=> window.location.href = "/home/guessinggame"}>Guess Teams</button>
  </div>
  
  {/if}
  <Toggle text1="Match" text2="Super" bind:value={scouttype}/>
  {#if isOnline}
  <div>
<h1>Online Scouting</h1>
  <center>
    <Toggle text1="Queue" text2="Manual" bind:value={assign}/>
    {#if assign == 0}
    {#if !queuing}
        <button style="margin: 1rem; width: 75%; background-color: lightgreen" on:click={queue}>Enter Queue</button>
    {:else}
    <button style="margin: 1rem; width: 75%; background-color: red" on:click={removequeue}>Leave Queue</button>
    {/if}
    {:else}
    <input type="number" placeholder="Team Number" bind:value={$teamKey} style="background-color: lightgray; margin: 0;"/><h1></h1>
    <input type="text" placeholder="Match Key" bind:value={$matchKey} style="background-color: lightgray; margin: 0;"/><h1></h1>
    <button style="margin-left: 1rem" on:click={manual}>Scout</button>
    {/if}
</center>
</div>
  {:else}
  <div>
    <center>
    <h1>Offline Scouting</h1>
    <input type="number" placeholder="Team Number" bind:value={$teamKey} style="background-color: lightgray; margin: 0;"/><h1></h1>
    <input type="text" placeholder="Match Key" bind:value={$matchKey} style="background-color: lightgray; margin: 0;"/><h1></h1>
  <button style="margin-left: 1rem" on:click={manual}>Scout</button>
</center>
</div>


  {/if}
{#if message != ""}
  <div style="background-color: crimson;">{message}</div>
{/if}
{#if goodnews != ""}
  <div style="background-color: lightgreen;">{goodnews}</div>
{/if}
  <style>
    button {
      background-color: lightgray;
      margin: 0;
    }
    input
    {
      width: calc(100% - 2rem);
      height: 100%;
      margin: 0;
    }
  </style>

  