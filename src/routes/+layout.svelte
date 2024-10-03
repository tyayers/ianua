<script lang="ts">
	import { fade, fly } from "svelte/transition";

	import "../app.css";

	export let data;

	function sendCancel() {
		//First, we initialize our event
		const event = new Event("cancelEvent");
		// Next, we dispatch the event.
		document.dispatchEvent(event);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#key data.url}
	<div id="layout_box" on:click={sendCancel} on:keyup={sendCancel} in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
	<!-- <div id="layout_box" on:click={sendCancel} on:keyup={sendCancel} in:fly={{ x: 50, duration: 150, delay: 150 }} out:fly={{ x: -50, duration: 150 }}> -->
		<slot />
	</div>
{/key}

<style>
	#layout_box {
		height: 100vh;
		overflow-y: scroll;
	}
</style>
