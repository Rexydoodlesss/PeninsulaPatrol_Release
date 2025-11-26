<script>
    import { onMount } from 'svelte';
    import io from 'socket.io-client';
    let username = "";
    let scouttype = "Match";
    let isOnline = true;
    let eventkey = "";
    let matchkey="";
    let link="";
    let linktype = 1;
    let red1;
    let red2;
    let red3;
    let blue1;
    let blue2;
    let blue3;
    let message = "";
    let error = "";
    let lastqm = 0;
    let socket;
    let comped=[];
    let compedsuper=[];
    let assigned=[]
    let superassigned=[]
  
    onMount(() => {
        socket = io('https://still-coast-90996-0172ad985f08.herokuapp.com/');
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            username = sessionStorage.getItem('username');
            isOnline = navigator.onLine;
            if (!username.toLocaleLowerCase().includes("admin")) {
                window.location.href = '/home';
            }
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
        }

        socket.on('compmatch', (name) => {
            comped = [...comped, name];
    });
    socket.on('compsuper', (name) => {
        compedsuper = [...compedsuper, name];
    });

    socket.on('receivedmatch', (name) => {
            assigned = [...assigned, name];
    });
    socket.on('receivedsuper', (name) => {
        superassigned = [...superassigned, name];
    });
    });
  
    function updateOnlineStatus() {
      isOnline = navigator.onLine;
    }

    function submitekey()
    {
        if (eventkey) {
            socket.emit('eventkey', eventkey);
            message = "Event key sent successfully!";
            eventkey = "";
        } else {
            error = "Please enter an event key.";
        }
    }

    function submitlink() {
        if (link) {
      if (linktype == 1) {
        socket.emit('datasheet', link);
      } else {
        socket.emit('pitscout', link);
      }
      message = "Link sent successfully!";
      link = "";
    } else {
      error = "Please enter a link.";
    }
  }

    async function loadekey()
    {
            try {
                const response = await fetch(`https://www.thebluealliance.com/api/v3/match/${matchkey}`, {
                    headers: {
                        'X-TBA-Auth-Key': 'wlltR8jyjHBcLG0tA7Zg6EEMRs6qLmBtYr9euIr9NzvyOr7PaLlpedreymRQA7dY'
                    }
                });

                if (!response.ok) {
                    error="Failed to fetch match data from TBA";
                    message="";
                    throw new Error('Failed to fetch match data');
                }
                const data = await response.json();
                red1 = data.alliances.red.team_keys[0].replace('frc', '');
                red2 = data.alliances.red.team_keys[1].replace('frc', '');
                red3 = data.alliances.red.team_keys[2].replace('frc', '');
                blue1 = data.alliances.blue.team_keys[0].replace('frc', '');
                blue2 = data.alliances.blue.team_keys[1].replace('frc', '');
                blue3 = data.alliances.blue.team_keys[2].replace('frc', '');
                message = "Match data loaded successfully!";
                error = "";
                const matchNumber = matchkey.match(/qm(\d+)/);
                if (matchNumber) {
                    lastqm = parseInt(matchNumber[1], 10);
                }
            } catch (err) {
                error = err.message;
                message = "";
            }
    }

    function startqueue()
    {
        if (red1 && red2 && red3 && blue1 && blue2 && blue3 && matchkey) {
            socket.emit('queueinitiate', {red1, red2, red3, blue1, blue2, blue3, matchkey});
            message = "Queue started successfully!";
            error = "";
            red1 = "";
            red2 = "";
            red3 = "";
            blue1 = "";
            blue2 = "";
            blue3 = "";
            matchkey = "";
            comped=[];   
            superassigned = [];
            compedsuper = []
            assigned = []
        } else {
            error = "Please fill in all team keys";
            message = "";
        }
    }
  </script>
  <div><h1>Admin Dashboard</h1>
  <p>{isOnline ? 'You are online' : 'You are offline; no functionality'}</p></div>
  {#if isOnline}
  <div class="grid grid-cols-2 grid-rows-3">
    <div style="background-color: lightgray;">
        <h2>Event Key</h2>
        <div style="margin-left: 0.5rem">
        <input type="text" placeholder="e.g. 2025arc" bind:value={eventkey} style="background-color: lightgray; margin: 0; margin-left: 0.5rem; margin-top: 0.5rem"/><h1></h1>
        <button style="margin-left: 0.5rem; margin-top: 0.5rem; background-color: lightgray" on:click={submitekey}>Submit</button>  
    </div>
    </div>

    <div style="background-color: lightgray;">
        <h2>Link Input</h2>
        <div style="margin-left: 0.5rem;">
        <input value=1 type="radio" name="linktype" bind:group={linktype}> Data Sheet
        <input value=2 type="radio" name="linktype" bind:group={linktype}> Pit Scouting
    </div>
    <div class="grid grid-cols-2 grid-rows-1" style="margin-left: 0.5rem">
        <input type="text" placeholder="Select which link" bind:value={link} style="background-color: lightgray; margin: 0; margin-left: 0.5rem"/>
        <button class="justify-self-end" style="margin-left: 0.5rem; margin: 0; background-color: lightgray; padding: 8px; width: 50%" on:click={submitlink}>Submit</button>
    </div>
    </div>
        
    <div  style="background-color: lightgray;">
        <div class="grid grid-cols-2 grid-rows-1" style="background-color: lightgray; margin: 0rem; padding: 0rem">
        <h2 style="grid-column: span 2;">Datapoints Collected</h2>
        <div>
            <h2 style="margin: 0rem;">Match</h2>
            {#if comped.length != 0}
            {#each comped as comp}
            <p>
            {comp}
        </p>
            {/each}
            {:else}
            <h2 style="color: crimson">No Submitted Match Data</h2>
            {/if}
        </div>
        <div>
            <h2 style="margin: 0">Super</h2>
            {#if compedsuper.length != 0}
            {#each compedsuper as comp}
            <p>
            {comp}
        </p>
            {/each}
            {:else}
            <h2 style="color: crimson">No Submitted Super Data</h2>
            {/if}
        </div>
    </div>
    </div>

    <div class="col-span-1 row-span-2" style="background-color: lightgray;">
        <h2 style="margin-left: 0.5rem;">Queue</h2>
        {#if lastqm != 0}
            <p>Last loaded QM: {lastqm}</p>
        {/if}
        <div class="grid grid-cols-2 grid-rows-1" style="margin-left: 0.5rem; padding: 0.5rem">
            <input type="text" style="background-color: darkgray; border-style: none; margin: 0" placeholder="e.g 2025bcvi_qm3" bind:value={matchkey}>
            <button class="justify-self-end" style="background-color: lightgray; width: 25%" on:click={loadekey}>Load</button>
        </div>
        <div style="margin-left: 0.5rem" class="grid grid-cols-2 grid-rows-1">
            <div class="grid grid-cols-1 grid-rows-3 gap-2" style="background-color: lightgray;">
                <input type="number" placeholder="Red 1" bind:value={red1} style="background-color: crimson; color: black; margin: 0; margin-left: 0.5rem"/>
                <input type="number" placeholder="Red 2" bind:value={red2} style="background-color: crimson; color: black; margin: 0; margin-left: 0.5rem"/>
                <input type="number" placeholder="Red 3" bind:value={red3} style="background-color: crimson; color: black; margin: 0; margin-left: 0.5rem"/>
            </div>
            <div class="grid grid-cols-1 grid-rows-3 gap-2" style="background-color: lightgray;">
                <input type="number" placeholder="Blue 1" bind:value={blue1} style="background-color: royalblue; color: black; margin: 0; margin-left: 0.5rem"/>
                <input type="number" placeholder="Blue 2" bind:value={blue2} style="background-color: royalblue; color: black; margin: 0; margin-left: 0.5rem"/>
                <input type="number" placeholder="Blue 3" bind:value={blue3} style="background-color: royalblue; color: black; margin: 0; margin-left: 0.5rem"/>
            </div>
            <button class="col-span-2" style="margin-left: 0.5rem; background-color: lightgray" on:click={startqueue}>Submit</button>  
        </div>
        {#if error}
  <div style="background-color: red;">{error}</div>
{:else if message}
  <div style="background-color: lightgreen;">{message}</div>
{/if}
    </div>

    <div style="background-color: lightgray;">
        Assigned Scouts
        <div class="grid grid-cols-2 grid-rows-1" style="background-color: lightgray; margin: 0rem; padding: 0rem">
            <div>
                <h2 style="margin: 0rem;">Match</h2>
                {#if assigned.length != 0}
            {#each assigned as comp}
            <p>
            {comp}
        </p>
            {/each}
            {:else}
            <h2 style="color: crimson">No Assigned Match Scouts</h2>
            {/if}
            </div>
            <div>
                <h2 style="margin: 0rem;">Super</h2>
                {#if superassigned.length != 0}
            {#each superassigned as comp}
            <p>
            {comp}
        </p>
            {/each}
            {:else}
            <h2 style="color: crimson">No Assigned Super Scouts</h2>
            {/if}
            </div>
        </div>
    </div>
  </div>
{:else}
<div><h1>You are offline; get online as soon as possible!</h1></div>
{/if}
  <style>
    ::placeholder
    {
        color: white;
        opacity: 75%;
    }
  </style>
