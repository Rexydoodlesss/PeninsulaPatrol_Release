<script>
    import { onMount } from 'svelte';
    

    let username = '';
    let entered = '';
    let failed = false;
    let isOnline = false;
    onMount(async () => {
        sessionStorage.setItem('qrs', []);
        sessionStorage.setItem('storeddata', []);
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            isOnline = navigator.onLine;
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
        }
    });

    function updateOnlineStatus() {
        if (typeof navigator !== 'undefined') {
            isOnline = navigator.onLine;
        }
    }

    function checkPassword() {
            sessionStorage.setItem('username', username);
            document.cookie = `password=${entered}; path=/`;
            window.location.href = '/home'; 
    }
</script>

<h1 style="margin-bottom: 0rem;">Welcome to <span style="color: #214D89;">Peninsula</span> <span style="color: #214D89;">Scout</span></h1>
<p>{isOnline ? 'You are online' : 'You are offline'}</p>
<form class="grid grid-cols-1 grid-rows-3" on:submit|preventDefault={checkPassword}>
    <input type="text" placeholder="Username" bind:value={username} style="background-color: lightgray; margin-bottom: 0"/>
    <input type="password" placeholder="Password" bind:value={entered} style="background-color: lightgray; margin-bottom: 0" />
    <button style="background-color: lightgray;" type="submit">Login</button>
</form>
{#if failed}
    <p style="color: crimson;">Incorrect password. Please try again.</p>
{/if}