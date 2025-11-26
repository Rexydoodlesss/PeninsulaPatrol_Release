<script>
    export let selected = 0
    export let text1 = "test1";
    export let text2 = "test2";
    export let text3 = "test3";
    function select(num) {
        selected = num
        if (selected == 0) {
            document.getElementById('l1').style.backgroundColor = '#214D89';
            document.getElementById('l1').style.color = 'lightgray';
            document.getElementById('l2').style.backgroundColor = 'lightgray';
            document.getElementById('l3').style.color = 'black';
            document.getElementById('l2').style.color = 'black';
            document.getElementById('l3').style.backgroundColor = 'lightgray';
        }
        else if (selected == 1) {
            document.getElementById('l1').style.backgroundColor = 'lightgray';
            document.getElementById('l2').style.backgroundColor = '#214D89';
            document.getElementById('l2').style.color = 'lightgray';
            document.getElementById('l3').style.backgroundColor = 'lightgray';
            document.getElementById('l3').style.color = 'black';
            document.getElementById('l1').style.color = 'black';
        }
        else if (selected == 2) {
            document.getElementById('l1').style.backgroundColor = 'lightgray';
            document.getElementById('l1').style.color = 'black';
            document.getElementById('l2').style.backgroundColor = 'lightgray';
            document.getElementById('l2').style.color = 'black';
            document.getElementById('l3').style.backgroundColor = '#214D89';
            document.getElementById('l3').style.color = 'lightgray';
        }
    }
</script>

<div style="padding: 0;" class="grid grid-rows-1 grid-cols-3 border border-gray">
    <div id="l1" class="text-center flex items-center justify-center" style="background-color: #214D89; color: lightgray; font-weight: bold; margin: 0; border-bottom-right-radius: 0; border-top-right-radius: 0" on:click={() => select(0)}>{text1}</div>
    <div id="l2" class="text-center flex items-center justify-center" style="background-color: lightgray; font-weight: bold; margin: 0; border-radius:0" on:click={() => select(1)}>{text2}</div>
    <div id="l3" class="text-center flex items-center justify-center" style="background-color: lightgray; font-weight: bold; border-top-left-radius: 0; border-bottom-left-radius: 0; margin: 0" on:click={() => select(2)}>{text3}</div>   
</div>
