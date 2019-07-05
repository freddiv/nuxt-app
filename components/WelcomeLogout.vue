<template>
	<div>
		<span class="white-text font-weight-bold mr-5">{{ welcome}} </span>
		<mdb-btn icon="user" iconClass="pr-2" iconLeft @click.native="logout">
			<span class="white-text font-weight-bold">Logout</span>
		</mdb-btn>
	</div>
</template>

<script>
import {mdbBtn} from 'mdbvue'

export default {
	name: 'WelcomeLogout',
	components: {mdbBtn},
	computed: {
		welcome() {
			const user = {
				first_name: 'Freddie',
				last_name: 'Valone',
				id: 1,
			}
			const welcome =  `Welcome ${user.first_name}  ${user.last_name}`
			return welcome
		},
	},
}
</script>

