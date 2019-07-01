<template>
	<div class="isActiveUser">
		<mdb-badge v-if="this.params.value" color="success-color"><span>Active</span> </mdb-badge>
		<mdb-badge v-else color="danger-color"><span>Deactivated</span> </mdb-badge>
	</div>
</template>

<script>
import { mdbBadge } from 'mdbvue'
export default {
	name: 'RenderIsActive',
	components: { mdbBadge},
}
</script>

<style lang="scss" scoped>
.isActiveUser {
	display: flex;
	align-items: top;
	margin:  2px !important;
	width: 90%;
	height: 100%;

	.badge{
		height: 15px;
		margin-bottom: 5px !important;
		padding-top: 4px;
		width: 90%;

		span {
			text-align: center;
			width: 100%;
		}
	}
}

</style>