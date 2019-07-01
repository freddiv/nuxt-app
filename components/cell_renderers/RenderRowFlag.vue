<template>
	<div class="rowFlag">
		<mdb-badge v-if="!this.params.value || this.params.value === 'Pass'" color="success-color"><span>Pass</span> </mdb-badge>
		<mdb-badge v-else color="warning-color"><span>Change</span> </mdb-badge>
	</div>
</template>

<script>
import { mdbBadge } from 'mdbvue'
export default {
	name: 'RenderRowFlag',
	components: { mdbBadge},
	computed: {
		arrayList() {
			const data = this.params.value

			return data
		},

	},
}
</script>

<style lang="scss" scoped>
.rowFlag {
	display: flex;
	align-items: top;
	margin:  2px !important;
	width: 90%;
	height: 100%;

	.badge{
		height: 22px;
		margin-bottom: 5px !important;
		padding-top: 3px;
		width: 90%;

		span {
			text-align: center;
			width: 100%;
			font-size: 1rem;
		}
	}
}

</style>