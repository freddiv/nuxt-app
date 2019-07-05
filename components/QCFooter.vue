<template>
	<Footer color="default-color align-middle">
		<div class="d-flex flex-lg-row d-inline-flex w-100 mt-5">
			<div class="d-flex flex-column justify-content-start h-100 w-25">
				<img class="img-fluid w-100 h-100 ml-2" alt="Responsive image" src="../assets/epa-logo-1.png">
			</div>
			<div class="d-flex flex-row justify-content-around w-75">
				<nuxt-link to="/about" class="info-ic">
					<mdb-tooltip :options="{placement: 'top'}">
						 <span slot="tip">About Data Accuracy Tool</span>
						<i slot="reference" class="fa fa-info-circle white-text mr-md-5 mr-3 fa-3x"/>
					</mdb-tooltip>
				</nuxt-link>
				<nuxt-link to="/help" class="info-ic">
					<mdb-tooltip :options="{placement: 'top'}">
						 <span slot="tip">Data Accuracy Tool Help</span>
						<i slot="reference" class="far fa-question-circle white-text mr-md-5 mr-3 fa-3x"/>
					</mdb-tooltip>
				</nuxt-link>
				<nuxt-link to="/contact" class="info-ic">
					<mdb-tooltip :options="{placement: 'top'}">
						 <span slot="tip">Contact us</span>
						<i slot="reference" class="fa fa-at white-text mr-md-5 mr-3 fa-3x"/>
					</mdb-tooltip>
				</nuxt-link>
			</div>
		</div>
	</Footer>
</template>


<script>

import {
	Footer,
	mdbTooltip,
} from '~/node_modules/mdbvue'

export default {
	name: 'QCFooter',
	components: {
		Footer,
		mdbTooltip,
	},
	data() {
		return {
			error: window.localStorage.getItem('error') || null,
		}
	},
	computed: {
		isError() {
			return this.error
		},
		isLoggedIn() {
			return true
		},
	},
	methods: {
		close() {

		},
	},
	onRender() {

	},
}
</script>

<style scoped>
footer {
	height: 115px !important;
}
</style>
