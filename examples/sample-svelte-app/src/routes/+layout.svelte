<script lang="ts">
    import Provider from '$lib/provider.svelte';

    let { children } = $props();
</script>

<Provider>
    {@render children()}
</Provider>
