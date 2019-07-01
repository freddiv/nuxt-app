<template>
	<div>
		<mdb-badge class="domains" v-for="item in this.params.value" color="primary-color">{{ item.name }}</mdb-badge>
	</div>
</template>

<script>
import { mdbBadge, mdbChip } from 'mdbvue'
export default {
	name: 'RenderObjArray',
	components: { mdbBadge, mdbChip},
	computed: {
		arrayList() {
			console.log(this.params)
			const data = this.params.value
			let displayVal = []
			if (data) {
				displayVal = data
			}
			return displayVal
		},
	},
}
</script>

<style lang="scss" scoped>
.domains {
	margin: 4px 0px 1px 0px;
	padding: 5px 0px 5px 0px !important;
	display:block;
	overflow: hidden;
}
.listContainer {
	margin: 0px 0px 0px 0px;
	display:block;
	height: 65px !important;
}
</style>