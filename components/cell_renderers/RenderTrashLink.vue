<template>
	<div class="iconContainer">
		<mdb-icon icon="trash-alt" size="2x" class="red-text pr-3 ml-2" aria-hidden="true"/>
	</div>
</template>

<script>
import { mdbIcon, } from 'mdbvue'
export default {
	name: 'RenderTrashLink',
	components: { mdbIcon,},
}
</script>

<style lang="scss" scoped>
.iconContainer {
	height: 2.4rem !important;
	padding-top: .3rem !important;
	vertical-align: middle !important;
}
.large {
	font-size:      20px;
	text-align:     center;
	vertical-align: middle;
}
</style>