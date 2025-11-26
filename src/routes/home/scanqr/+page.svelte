<script>
    import { onMount } from 'svelte';
    import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
    import pako from 'pako';

    let message = "";
    let uploading = false;
    let videoElement;

    function base64ToUint8Array(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    function decodeCompressedData(base64) {
        try {
            const compressedData = base64ToUint8Array(base64);
            const decompressedData = pako.inflate(compressedData, { to: 'string' });
            return JSON.parse(decompressedData);
        } catch (error) {
            console.error('Error decoding compressed data:', error);
            throw new Error('Failed to decode compressed data');
        }
    }

    onMount(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
            if (result) {
                onScanSuccess(result.getText());
            }
            if (err && !(err instanceof NotFoundException)) {
                message = "Failed to upload data: " + err.message;
                console.error("QR Code Scan Error:", err);
            }
        });
    });

    function onScanSuccess(decodedText) {
        if (!uploading){
            uploading = true;
        let data;
        let endpoint = '/api/matchupload';
        let payload;

            try {
                data = decodeCompressedData(decodedText);
            } catch (error) {
                message = "Failed to decode compressed data";
                return;
            }
            if (data.superScoutingNotes) {
                endpoint = '/api/superupload'
            payload = {
                username: data.username,
                matchKey: data.matchKey,
                teamKey: data.teamKey,
                defended: data.defended,
                defenseQuality: data.defenseQuality,
                climbTime: data.climbTime,
                penalties: data.penalties,
                superScoutingNotes: data.superScoutingNotes
            };
            }
            else
            {
                endpoint = '/api/matchupload'
                payload = {
                username: data.username,
            teamKey: data.teamKey,
            matchKey: data.matchKey,
            autoLeave: data.autoLeave,
            autoL1Success: data.autoL1Success,
            autoL1Failure: data.autoL1Failure,
            autoL2Success: data.autoL2Success,
            autoL2Failure: data.autoL2Failure,
            autoL3Success: data.autoL3Success,
            autoL3Failure: data.autoL3Failure,
            autoL4Success: data.autoL4Success,
            autoL4Failure: data.autoL4Failure,
            teleL1Success: data.teleL1Success,
            teleL1Failure: data.teleL1Failure,
            teleL2Success: data.teleL2Success,
            teleL2Failure: data.teleL2Failure,
            teleL3Success: data.teleL3Success,
            teleL3Failure: data.teleL3Failure,
            teleL4Success: data.teleL4Success,
            teleL4Failure: data.teleL4Failure,
            autoAlgaeDescoreSuccess: data.autoAlgaeDescoreSuccess,
            autoAlgaeDescoreFailure: data.autoAlgaeDescoreFailure,
            autoAlgaeNetSuccess: data.autoAlgaeNetSuccess,
            autoAlgaeNetFailure: data.autoAlgaeNetFailure,
            autoAlgaeProcessorSuccess: data.autoAlgaeProcessorSuccess,
            autoAlgaeProcessorFailure: data.autoAlgaeProcessorFailure,
            teleAlgaeDescoreSuccess: data.teleAlgaeDescoreSuccess,
            teleAlgaeDescoreFailure: data.teleAlgaeDescoreFailure,
            teleAlgaeNetSuccess: data.teleAlgaeNetSuccess,
            teleAlgaeNetFailure: data.teleAlgaeNetFailure,
            teleAlgaeProcessorSuccess: data.teleAlgaeProcessorSuccess,
            teleAlgaeProcessorFailure: data.teleAlgaeProcessorFailure,
            defense: data.defense,
            broke: data.broke,
            notes: data.notes,
            deepSuccess: data.deepSuccess,
            deepFailure: data.deepFailure,
            shallowSuccess: data.shallowSuccess,
            shallowFailure: data.shallowFailure,
            parkSuccess: data.parkSuccess,
            parkFailure: data.parkFailure,
            incap: data.incap
            }
            };

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(async response => {
            const result = await response.json();
            if (response.ok) {
                window.location.href = '/home';
            } else {
                message = "Failed to upload data: " + result.error;
                console.error('Error uploading data:', result.error);
            }
        })
        .catch(error => {
            message = "Failed to upload data: " + error.message;
            console.error('Error uploading data:', error);
        });
    }
}

</script>

<!-- HTML for QR Code Scanner -->
<h1>QR Scanner</h1>
<div>
    <video bind:this={videoElement} class="qr-reader"></video>
    <center>
        <button style="background-color: lightgray;" on:click={() => window.location.href = '/home'}>Return to Home</button>
    </center>
    {#if message}
        <div style="background-color: crimson;">{message}</div>
    {/if}
    {#if uploading}
        <h1>Uploading, please wait...</h1>
    {/if}
</div>

<style>
    .qr-reader {
        width: calc(100% - 2rem);
        margin: 1rem;
        box-sizing: border-box;
    }

    @media (max-width: 600px) {
        .qr-reader {
            width: 90%;
        }
    }
</style>