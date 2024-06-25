<script lang="ts">
	import '../app.css';

	function sendCancel() {
		//First, we initialize our event
		const event = new Event('cancelEvent');
		// Next, we dispatch the event.
		document.dispatchEvent(event);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={sendCancel} on:keyup={sendCancel}>

  <slot />

</div>
