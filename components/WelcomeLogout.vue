<template>
	<div>
		<span class="white-text font-weight-bold mr-5">{{ userName}} {{ getUser.last_Name}} </span>
		<mdb-btn icon="user" iconClass="pr-2" iconLeft @click.native="logout">
			<span class="white-text font-weight-bold">Logout</span>
		</mdb-btn>
	</div>
</template>

<script>
import {mdbBtn} from 'mdbvue'
import {mapActions, mapGetters} from 'vuex'

export default {
	name: 'WelcomeLogout',
	components: {mdbBtn},
	computed: {
		...mapGetters(['getUser', 'unallocatedRecordsList', 'allocationColumnDefs', 'allocationsList']),
		userName() {
			var display = this.getUser
			return `Hello ${this.getUser.first_name}`
		},
	},
	methods: mapActions(['logout']),
}
</script>

