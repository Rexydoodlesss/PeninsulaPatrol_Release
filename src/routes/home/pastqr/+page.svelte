<script>
    import { onMount } from "svelte";
    let qrs = [];
    let empty = [];
    let displayed="";
    let isOnline = false;
    let type;
    let selectednum = 0;
    let clicks = 0;
    let gouda = "";
    let message = "";
    function reset() {
        clicks++;
        if (clicks > 2){
        if (typeof window !== 'undefined') {
            localStorage.setItem('qrs', JSON.stringify(empty));
            localStorage.setItem('storeddata', JSON.stringify(empty));
            window.location.reload();
        }
    }
    else
        {
            message="Are you sure you want to reset the QR memory? This action cannot be undone.";
        }
    }

    onMount(() => {
        isOnline = navigator.onLine;
        window.addEventListener('online', updateOnlineStatus);
          window.addEventListener('offline', updateOnlineStatus);
        if (typeof window !== 'undefined') {
            const storedQrs = localStorage.getItem('qrs');
            if (storedQrs) {
                qrs = JSON.parse(storedQrs);
            }
        }
    });
    function updateOnlineStatus() {
      if (typeof navigator !== 'undefined') {
          isOnline = navigator.onLine;
      }
  }
  async function upeload() {
        const storedData = JSON.parse(localStorage.getItem('storeddata'));
        const data = storedData[selectednum];
        let endpoint;
        if (data.defenseQuality) {
            endpoint = '/api/superupload';

        } else {
            endpoint = '/api/matchupload';
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                gouda = "Data uploaded successfully.";
                storedData.splice(selectednum, 1);
                localStorage.setItem('storeddata', JSON.stringify(storedData));
                qrs.splice(selectednum, 1);
                localStorage.setItem('qrs', JSON.stringify(qrs));
                displayed = "";
                type = "";
                selectednum = null;
                window.location.reload();
            } else {
                message = "Failed to upload data: " + result.error;
            }
        } catch (error) {
            message = "Error uploading data: " + error.message;
        }
    }
    async function remove()
    {
        const storedData = JSON.parse(localStorage.getItem('storeddata'));
        const data = storedData[selectednum];
        if (storedData.length == 1)
        {
            localStorage.setItem('storeddata', JSON.stringify(empty));
        }
        else{
        storedData.splice(selectednum, 1);
                localStorage.setItem('storeddata', JSON.stringify(storedData));
        }
        if (qrs.length == 1)
        {
            localStorage.setItem('qrs', JSON.stringify(empty));kk
        }
        else{

                qrs.splice(selectednum, 1);
                localStorage.setItem('qrs', JSON.stringify(qrs));
        }
                displayed = "";
                type = "";
                selectednum = null;
                window.location.reload();
    }
</script>

<h1 style="margin-bottom: 0.5rem;">Past QR Codes</h1>
<p style="margin-bottom:1rem;">{isOnline ? 'You are online; upload should work!' : 'You are offline; find a scanner!'}</p>
{#if qrs.length == 0}
    <div>No QR codes available</div>
{:else}
<div style="max-height: 50vh; overflow-y: auto;">
    <h2>Select a Match</h2>
    {#each qrs as qr}

        <div style="background-color: lightgray;" on:click={() => { displayed = qr[1]; type = qr[2]; selectednum = qr[3]}}>
                {qr[0]+""}
        </div>
    {/each}
</div>
{/if}
{#if displayed!= ""}
<div>
    <h1 style="margin-bottom: 2rem;">QR Code <strong>({type})</strong>:</h1>
    <center>
    <img src="{displayed}" alt="rip qr code scanning ig">
</center>
<center>
    {#if isOnline}
    <div class="grid grid-cols-3 grid-rows-1" style="margin: 0.5rem; padding: 0">
        <button style="margin: 0.5rem; font-size: 0.75rem" on:click={upeload}>Upload</button>
        <button style="margin: 0.5rem; font-size: 0.75rem" on:click={() => { displayed = ""; type = ""; }}>Close</button>
        <button style="background-color: crimson; margin: 0.5rem; font-size: 0.5rem" on:click={remove}>Remove</button>
    </div>
{:else}
<button style="margin-top: 1rem;" on:click={() => { displayed = ""; type = ""; }}>Close</button>
<button style="background-color: crimson;" on:click={remove}>Remove</button>
{/if}
</center>
</div>
{/if}
<div class="grid grid-cols-2 grid-rows-1">
    <button on:click={() => window.location.href = '/home'}>Return to Home</button>
    <button style="background-color: crimson;" on:click={reset}>Reset QR Memory</button>
</div>
{#if message}
    <div style="background-color: crimson;">{message}{#if message == "Are you sure you want to reset the QR memory? This action cannot be undone."}<p style="margin: 0; margin-top: 1rem">Click twice more to confirm</p>{/if}</div>
{:else if gouda}
    <div style="background-color: lightgreen;">{gouda}</div>
{/if}
<style>
button {
    background-color: lightgray;
}
</style>