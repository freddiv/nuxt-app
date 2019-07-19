<template>
	<div class="container-fluid mt-5">
		<h2> {{ heading }}</h2>
	</div>
</template>

<script>
export default {
    name: 'QcDashboard',
    computed: {
		heading() {
			const user = {
				first_name: 'Freddie',
				last_name: 'Valone',
				id: 1,
			}
			const heading =  ` ${user.first_name}'s QC Dashboard `
			return heading
		},
	},
}
</script>