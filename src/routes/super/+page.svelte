<script>
  import { onMount } from "svelte";
  import { matchKey } from '../../stores.js';
  import Super from "$lib/components/Super.svelte";
  let username;
  let isOnline = false;

  onMount(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      username = sessionStorage.getItem('username');
      isOnline = navigator.onLine;

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    }
  });

  function updateOnlineStatus() {
    isOnline = navigator.onLine;
  }
</script>

<Super/>