<template>
	<div class="listContainer" style="height:100px !important;">
		<mdb-badge class="domains" v-for="item in this.params.value" color="primary-color">{{ item.name }}</mdb-badge>
	</div>
</template>

<script>
import { mdbBadge, mdbChip } from 'mdbvue'
export default {
	name: 'RenderObjArray',
	components: { mdbBadge, mdbChip},
}
</script>

<style lang="scss" scoped>
.domains {
	margin: 4px 0px 1px 0px;
	padding: 5px 0px 5px 0px !important;
	display:block;
}
.listContainer {
	margin: 0px 0px 0px 0px;
	display:block;
	height: 65px !important;
	overflow-y: visible;
}

</style>