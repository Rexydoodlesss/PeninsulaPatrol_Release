<script>
    import Header from "./Header.svelte";
    import Threeselect from "./Threeselect.svelte";
    import Toggle from "./Toggle.svelte";
    import QRCode from 'qrcode';
    import pako from 'pako';
    import { color, teamKey, autoLeave, matchKey, autoL1Success, autoL1Failure, autoL2Success, autoL2Failure, autoL3Success, autoL3Failure, autoL4Success, autoL4Failure, teleL1Success, teleL1Failure, teleL2Success, teleL2Failure, teleL3Success, teleL3Failure, teleL4Success, teleL4Failure, autoAlgaeDescoreSuccess, autoAlgaeDescoreFailure, autoAlgaeNetSuccess, autoAlgaeNetFailure, autoAlgaeProcessorSuccess, autoAlgaeProcessorFailure, teleAlgaeDescoreSuccess, teleAlgaeDescoreFailure, teleAlgaeNetSuccess, teleAlgaeNetFailure, teleAlgaeProcessorSuccess, teleAlgaeProcessorFailure, defense, broke, notes, deepSuccess, deepFailure, shallowSuccess, shallowFailure, parkSuccess, parkFailure, incap} from '../../stores';
    import { onMount } from 'svelte';
    import io from 'socket.io-client';
    import { Socket } from "socket.io-client";
    let result = 0;
    let eventual = "";
    let message= "";
    let climb = 0;
    let qrhere = false;
    let username;
    let socket;
    let uploading = false;
    if (typeof window !== 'undefined') {
        username = sessionStorage.getItem('username');
        io('https://still-coast-90996-0172ad985f08.herokuapp.com/');
    }

    const generateQRCode = async (data) => {
        try {
            const qrCodeData = await QRCode.toDataURL(data);
            eventual = qrCodeData;
            let qrs = JSON.parse(localStorage.getItem('qrs')) || [];
            qrs.push([$matchKey, qrCodeData, "match", qrs.length, false]);
            localStorage.setItem('qrs', JSON.stringify(qrs));
            qrhere = true;
        } catch (err) {
            console.error("QR code failed to generate");
        }
    };

    function uint8ArrayToBase64(uint8Array) {
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return window.btoa(binary);
    }

    async function submit() {
    if (!uploading)
    {
        uploading = true;
        if (climb == 0 && result == 0)
        {
            $parkSuccess++;
        }
        else if (climb == 0 && result == 1)
        {
            $parkFailure++;
        }
        else if (climb == 1 && result == 0)
        {
            $shallowSuccess++;
        }
        else if (climb == 1 && result == 1)
        {
            $shallowFailure++;
        }
        else if (climb == 2 && result == 0)
        {
            $deepSuccess++;
        }
        else if (climb == 2 && result == 1)
        {
            $deepFailure++;
        }
        const data = {
            username: username,
            teamKey: $teamKey,
            matchKey: $matchKey,
            autoLeave: $autoLeave,
            autoL1Success: $autoL1Success,
            autoL1Failure: $autoL1Failure,
            autoL2Success: $autoL2Success,
            autoL2Failure: $autoL2Failure,
            autoL3Success: $autoL3Success,
            autoL3Failure: $autoL3Failure,
            autoL4Success: $autoL4Success,
            autoL4Failure: $autoL4Failure,
            teleL1Success: $teleL1Success,
            teleL1Failure: $teleL1Failure,
            teleL2Success: $teleL2Success,
            teleL2Failure: $teleL2Failure,
            teleL3Success: $teleL3Success,
            teleL3Failure: $teleL3Failure,
            teleL4Success: $teleL4Success,
            teleL4Failure: $teleL4Failure,
            autoAlgaeDescoreSuccess: $autoAlgaeDescoreSuccess,
            autoAlgaeDescoreFailure: $autoAlgaeDescoreFailure,
            autoAlgaeNetSuccess: $autoAlgaeNetSuccess,
            autoAlgaeNetFailure: $autoAlgaeNetFailure,
            autoAlgaeProcessorSuccess: $autoAlgaeProcessorSuccess,
            autoAlgaeProcessorFailure: $autoAlgaeProcessorFailure,
            teleAlgaeDescoreSuccess: $teleAlgaeDescoreSuccess,
            teleAlgaeDescoreFailure: $teleAlgaeDescoreFailure,
            teleAlgaeNetSuccess: $teleAlgaeNetSuccess,
            teleAlgaeNetFailure: $teleAlgaeNetFailure,
            teleAlgaeProcessorSuccess: $teleAlgaeProcessorSuccess,
            teleAlgaeProcessorFailure: $teleAlgaeProcessorFailure,
            defense: $defense,
            broke: $broke,
            notes: $notes,
            deepSuccess: $deepSuccess,
            deepFailure: $deepFailure,
            shallowSuccess: $shallowSuccess,
            shallowFailure: $shallowFailure,
            parkSuccess: $parkSuccess,
            parkFailure: $parkFailure,
            incap: $incap
        };
        const jsonData = JSON.stringify(data);
        const compressedData = pako.deflate(jsonData);
        const base64Data = uint8ArrayToBase64(compressedData);

        try {
            const response = await fetch('/api/matchupload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            
            const result = await response.json();
            if (response.ok) {
                socket = io('https://still-coast-90996-0172ad985f08.herokuapp.com/');
                socket.emit('completedmatch', username);
                window.location.href = '/home';
            } else {
                await generateQRCode(base64Data);
                let lelocal = JSON.parse(localStorage.getItem('storeddata')) || [];
            lelocal.push(data);
            localStorage.setItem('storeddata', JSON.stringify(lelocal));
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            await generateQRCode(base64Data);
                let lelocal = JSON.parse(localStorage.getItem('storeddata')) || [];
            lelocal.push(data);
            localStorage.setItem('storeddata', JSON.stringify(lelocal));
        }
    }
    }
</script>

{#if !qrhere && !uploading}
<Header phase="Endgame" team={$teamKey} color={$color}/>
<div>
<Threeselect text1 = "Park" text2 = "Shallow Cage" text3 = "Deep Cage" bind:selected={climb}/>
<Toggle text1 = "Success" text2 = "Failiure" bind:value = {result}/>
<Toggle text1 = "Did Not Die/Break" text2 = "Died/Broke" bind:value = {$broke}/>
<textarea placeholder="Notes" bind:value={$notes}></textarea>
</div>
<center>
<button on:click={submit}>Submit</button>
</center>
{:else if qrhere}
<div>
    <h1>Qr Code:</h1>
    <center>
    <img  src="{eventual}" alt="bro how">
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