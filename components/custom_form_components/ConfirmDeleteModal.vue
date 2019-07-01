<template>
	<mdb-container  v-if="showConfirmation">
		<mdb-modal @close="showConfirmation = false">
			<mdb-modal-header>
				<mdb-modal-title>{{confirmationTitle}}</mdb-modal-title>
			</mdb-modal-header>
			<mdb-modal-body>{{confirmationText}}</mdb-modal-body>
			<mdb-modal-footer>
				<mdb-btn color="yellow" @click.native="showConfirmation = false"> Cancel </mdb-btn>
				<mdb-btn color="primary" @click.native="removeAllocation">{{buttonText}}</mdb-btn>
			</mdb-modal-footer>
		</mdb-modal>
	</mdb-container>
</template>

<script>
import {eventBus} from '../../main'
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbContainer, mdbCard, mdbCardTitle, mdbCardText, } from 'mdbvue';
import {mapActions, mapGetters} from 'vuex'

export default {
	name: 'ConfirmationModal',

	components: {
		mdbModal,
		mdbModalHeader,
		mdbModalTitle,
		mdbModalBody,
		mdbModalFooter,
		mdbBtn,
		mdbContainer,
	},
	props:{
		confirmationForm: String,
		confirmationTitle: String,
		confirmationText: String,
		buttonText: String,
	},
	data() {
		return {
			showConfirmation: false,
			allocationId: 0,
		}
	},
	computed: {
		...mapGetters(['recordsList', 'unallocatedRecordsList', 'allocationColumnDefs', 'allocationsList']),
		gridRef() {
			return this.gridApi
		},
		confirmationTitle() {
			let titleText = 'Verify Allocation Removal'

			return titleText
		},
		confirmationText() {
			let confirmationText = 'Are you sure you want to remove the remaining records from this allocation?'

			return confirmationText
		},
	},
	methods: {
		confirmAction(action){
		console.log(action)
		},

	},
}

</script>

<style lang="scss">

</style>