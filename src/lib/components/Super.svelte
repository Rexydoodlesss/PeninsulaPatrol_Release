<script>
    import Header from "./Header.svelte";
    import Toggle from "./Toggle.svelte";
    import { color, teamKey, superScoutingNotes, defenseQuality, climbTime, penalties, defended, matchKey } from '../../stores';
    import QRCode from 'qrcode';
    import pako from 'pako';
    import { json } from "@sveltejs/kit";
    import io from 'socket.io-client';
    import { Socket } from "socket.io-client";
    import e from "cors";
    let socket;
    let username;
    let uploading = false;
    if (typeof window !== 'undefined') {
        username = sessionStorage.getItem('username');
        io('https://still-coast-90996-0172ad985f08.herokuapp.com/');
    }
    let qrhere=false;
    let eventual="";
    function subtractpenalties() {
        if ($penalties > 0) {
            $penalties--;
        }
    }

    function uint8ArrayToBase64(uint8Array) {
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return window.btoa(binary);
    }
    async function submit() {
    if (!uploading) {
        uploading = true;
        const data = {
            username: username,
            teamKey: $teamKey,
            matchKey: $matchKey,
            defended: $defended,
            defenseQuality: $defenseQuality,
            climbTime: $climbTime,
            penalties: $penalties,
            superScoutingNotes: $superScoutingNotes
        };

        const jsonData = JSON.stringify(data);
        const compressedData = pako.deflate(jsonData);
        const base64Data = uint8ArrayToBase64(compressedData);

        try {
            const response = await fetch('/api/superupload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            
            const result = await response.json();
            if (response.ok) {
                socket = io('https://still-coast-90996-0172ad985f08.herokuapp.com/');
                socket.emit('completedsuper', username);
                window.location.href = '/home';
            } else {
                generateQRCode(base64Data);
                let lelocal = JSON.parse(localStorage.getItem('storeddata')) || [];
            lelocal.push(data);
            localStorage.setItem('storeddata', JSON.stringify(lelocal));
            }
        } catch (error) {
            generateQRCode(base64Data);
                let lelocal = JSON.parse(localStorage.getItem('storeddata')) || [];
            lelocal.push(data);
            localStorage.setItem('storeddata', JSON.stringify(lelocal));
        }
    }
    }
    const generateQRCode = async (data) => {
            try {
                const qrCodeData = await QRCode.toDataURL(data);
                eventual = qrCodeData;
                let qrs = JSON.parse(localStorage.getItem('qrs')) || [];
                qrs.push([$matchKey, qrCodeData, "super", qrs.length, false])
                localStorage.setItem('qrs', JSON.stringify(qrs));
                $color = ''; $teamKey = ''; $superScoutingNotes = ''; $defenseQuality = 0; $climbTime = 0; $penalties = 0; $defended = 0; $matchKey = '';
                qrhere = true;
            } catch (err) {
                console.error("QR code failed to generate");
            }
        };
</script>
{#if !qrhere && !uploading}
<Header team={$teamKey} color={$color} phase={"Super"}/>
<div>
  <Toggle text1="Did Not Defend" text2="Defended" bind:value={$defended}/>
  {#if $defended == 1}
    <h1>Defense Quality: {$defenseQuality}</h1>
    <input type="range" id="defenseQuality" min="1" max="5" bind:value={$defenseQuality}>
  {/if}
</div>
<div>
  <div style="background-color: lightgray; text-align: center; display: justify-content: center;" class="grid grid-cols-3 grid-rows-1">
    <h2 class="col-span-3" style="align-self: center; margin: 0">Penalties</h2>
    <button on:click={subtractpenalties}>-</button>
    <h2 style="align-self: center;">{$penalties}</h2>
    <button on:click={() => $penalties++}>+</button>
  </div>
  <h2 style="margin-left: 1rem; margin-top: 1.5rem">Climb Time (Seconds)</h2>
  <input type="number" placeholder="Type Here" bind:value={$climbTime} style="background-color: lightgray;"/>
</div>
<textarea placeholder="Notes" bind:value={$superScoutingNotes}></textarea>
<center>
  <button on:click={submit}>Submit</button>
</center>
{:else if qrhere}
<div>
<h1>Qr Code:</h1>
<center>
<img src="{eventual}" alt="bro how">
</center>
<center>
<button style="background-color: gray;" on:click={() => window.location.href = '/home'}>Return to Home</button>
</center>
<p>Remember: you don't need to scan now, you can access old QR codes through the "Past QR Codes" button on the homepage!</p>
</div>

{:else}
<div>
    <h1>Uploading</h1>
    <p>Please wait patiently, the backend is working its magic!</p>
    </div>
{/if}
<style>
    textarea {
        width: calc(100% - 2rem);
        height: 100px;
        padding: 1rem;
        margin: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        resize: vertical;
        background-color: lightgray;
    }
</style>