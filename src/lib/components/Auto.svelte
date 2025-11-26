<script>
    import { writable } from 'svelte/store';
    import Toggle from './Toggle.svelte';
    import { color, teamKey, autoL1Success, autoL1Failure, autoL2Success, autoL3Success, autoL2Failure, autoL3Failure, autoL4Success, autoL4Failure, autoAlgaeDescoreFailure, autoAlgaeNetFailure, autoAlgaeNetSuccess, autoAlgaeProcessorSuccess, autoAlgaeProcessorFailure, autoAlgaeDescoreSuccess, defense, autoLeave} from '../../stores';
    import Header from "./Header.svelte";
    import Subalgae from './Subalgae.svelte';
    import Subcoral from './Subcoral.svelte';
    import Algae from '$lib/svg/algae.svg';
    import Coral from '$lib/svg/coral.svg';
    let inalgae = false;
    let incoral = false;

</script>
{#if !inalgae && !incoral}
<Header color={$color} phase="Auto" team={$teamKey}/>
<div>
<Toggle text1 = "Did Not Taxi" text2 = "Taxiid" bind:value={$autoLeave}/>
</div>
<div style="height: 50vh;" class="grid grid-cols-2 grid-rows-1">
<button class="grid grid-cols-1 grid-rows-2 gap-4" style="background-color: #18dbbb; margin-left: 0" on:click={inalgae = true}><img style="align-self: end" src={Algae}><h1>Algae</h1></button>
<button class="grid grid-cols-1 grid-rows-2 gap-4" style="background-color: #e605c8; margin-right: 0" on:click={incoral = true}><img style="align-self: end" src={Coral}><h1>Coral</h1></button>
</div>
{:else if inalgae}
    <Subalgae bind:inalgae = {inalgae} phase = "Auto"/>
{:else}
    <Subcoral bind:incoral = {incoral} phase = "Auto"/>
{/if}

<style>
    h1
    {
        margin: 0
    }
</style>