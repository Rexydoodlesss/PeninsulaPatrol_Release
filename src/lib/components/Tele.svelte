<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { color, teamKey, teleL1Success, teleL1Failure, teleL2Success, teleL3Success, teleL2Failure, teleL3Failure, teleL4Success, teleL4Failure, teleAlgaeDescoreFailure, teleAlgaeNetFailure, teleAlgaeNetSuccess, teleAlgaeProcessorSuccess, teleAlgaeProcessorFailure, teleAlgaeDescoreSuccess, defense, incap} from '../../stores';
    import Header from "./Header.svelte";
    import { on } from 'svelte/events';
    import Algae from '$lib/svg/algae.svg';
    import Coral from '$lib/svg/coral.svg';
    import Subalgae from './Subalgae.svelte';
    import Subcoral from './Subcoral.svelte';
    let incapped=false
    let incapInterval
    let defendedtime = 0;
    let inalgae = false;
    let incoral = false;
    let incappedtime = 0;
    let defending = false;

    onMount(() => {

        incapInterval = setInterval(() => {
            if (incapped) {
                incappedtime++;
            }
            if (defending) {
                defendedtime++;
            }
        }, 1000);
    });
   function defensestart()
    {
        defending = true;
    }
    function defenseend()
    {
        if (defendedtime > 10)
            {
                $defense += defendedtime;
            }
            defendedtime = 0;
            defending = false;
    }
    function incapstart()
    {
            incapped = true;
    }

    function incapend()
    {
            if (incappedtime > 10)
            {
                $incap += incappedtime;
            }
            incappedtime = 0;
            incapped = false;
    }
</script>
{#if !incapped && !defending}
{#if !inalgae && !incoral}
<Header color={$color} phase="Tele" team={$teamKey}/>
<div class="grid grid-cols-2 grid-rows-1">
        <button on:click={defensestart}
            style="font-size: 1rem; background-color: lightblue">
            Defense
        </button>
    <button style="background-color: crimson;" on:click={incapstart}>
        Incap
    </button>
</div>

<div style="height: 50vh;" class="grid grid-cols-2 grid-rows-1">
    <button class="grid grid-cols-1 grid-rows-2 gap-4" style="background-color: #18dbbb; margin-left: 0" on:click={inalgae = true}><img style="align-self: end" src={Algae}><h1>Algae</h1></button>
    <button class="grid grid-cols-1 grid-rows-2 gap-4" style="background-color: #e605c8; margin-right: 0" on:click={incoral = true}><img style="align-self: end" src={Coral}><h1>Coral</h1></button>
    </div>
    {:else if inalgae}
        <Subalgae bind:inalgae = {inalgae} phase = "Tele"/>
    {:else}
        <Subcoral bind:incoral = {incoral} phase = "Tele"/>
    {/if}
{:else if incapped}
<Header color={$color} phase="Tele (Incapped)" team={$teamKey}/>
<div>
    <center>
    <h1 style="margin-bottom: 0;">Your robot is <span style="color: crimson;">incapacitated</span></h1>
    <h2>Incapacitated time: {incappedtime}</h2>
    <p>Total time: {$incap+incappedtime}</p>
    <button style="background-color: lightgray;" on:click={incapend}>Click to un-incapacitate</button>
</center>
</div>
{:else}
<Header color={$color} phase="Tele (Defending)" team={$teamKey}/>
<div>
    <center>
    <h1 style="margin-bottom: 0;">Your robot is <span style="color: lightblue;">defending</span></h1>
    <h2>Time Defended: {defendedtime}</h2>
    <p>Total time: {$defense+defendedtime}</p>
    <button style="background-color: lightgray;" on:click={defenseend}>Click to stop defending</button>
</center>
</div>
{/if}
