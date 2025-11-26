<script>
    let toggle = false;
    export let text1 = "test1";
    export let text2 = "test2";
    export let value = text1;
  
    function toggleoff() {
      toggle = !toggle;
      value = 0;
    }
  
    function toggleon() {
      toggle = !toggle;
      value = 1;
    }
  </script>
  
  {#if toggle}
    <div style="padding: 0;" class="grid grid-rows-1 grid-cols-2 border border-gray">
      <div style="margin: 0; background-color: lightgray; border-top-right-radius: 0; border-bottom-right-radius: 0" class="text-center flex items-center justify-center" on:click={toggleoff}>{text1}</div>
      <div class="text-center flex items-center justify-center" style="background-color: #214D89; color: lightgray; font-weight: bold; border-top-left-radius: 0; border-bottom-left-radius: 0; margin: 0;">{text2}</div>
    </div>
  {:else}
    <div style="padding: 0;" class="grid grid-rows-1 grid-cols-2 border border-gray">
      <div class="text-center flex items-center justify-center" style="background-color: #214D89; color: lightgray; font-weight: bold; border-top-right-radius: 0; border-bottom-right-radius: 0; margin: 0">{text1}</div>
      <div style="margin: 0; background-color: lightgray; border-bottom-left-radius: 0; border-top-left-radius: 0" class="text-center flex items-center justify-center" on:click={toggleon}>{text2}</div>
    </div>
  {/if}