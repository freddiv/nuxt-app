<template>
	<div style="height: 35px !important; overflow: visible">
		<QCLogo color="green" size="25px"><span class="smaller">  Review </span> </QCLogo>
	</div>
</template>

<script>
import { mdbIcon, } from 'mdbvue'
import QCLogo from '@/components/QCLogo'
export default {
	name: 'RenderReviewLink',
	components: { mdbIcon, QCLogo,},
}
</script>

<style lang="scss" scoped>
.smaller {
	font-size:      12px;
	font-weight: bold;
	margin-left: 7px;
	text-align:     center;
	vertical-align: middle;
}
</style>