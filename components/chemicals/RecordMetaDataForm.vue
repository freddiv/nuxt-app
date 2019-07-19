<template>
	<div>
		<mdb-container  v-if="showDataChangedModal">
			<mdb-modal @close="showDataChangedModal = false">
				<mdb-modal-header>
					<mdb-modal-title class="h3">{{dataChangedTitle}}</mdb-modal-title>
				</mdb-modal-header>
				<mdb-modal-body class="font-weight-bold">{{dataChangedText}}</mdb-modal-body>
				<mdb-modal-footer>
					<mdb-btn color="yellow" @click.native="showDataChangedModal = false"> Cancel </mdb-btn>
					<mdb-btn color="red" @click.native="continueNavigation()">Continue Anyway</mdb-btn>
				</mdb-modal-footer>
			</mdb-modal>
		</mdb-container>
		<card cascade class="text-left" style="height: 92%; width: 100%;">
			<mdb-card-header class="d-flex justify-content-between primary-color white-text" style="height:3.3rem;">
				<mdb-btn @click="getNewRecord(1)" tag="a" floating size="sm" class="mt-0" v-if="selectedRecordIndex > navBarMinItem" ><mdb-icon icon="angle-double-left" size="3x"/></mdb-btn>
				<mdb-btn tag="a" floating size="sm" class="mt-0"   v-else="selectedRecordIndex < navBarMinItem" disabled><mdb-icon icon="angle-double-left" size="3x" class="grey-text"/></mdb-btn>
				<mdb-btn @click="getNewRecord(selectedRecordIndex-1)"  tag="a" floating size="sm"  class="mt-0" v-if="selectedRecordIndex > navBarMinItem" ><mdb-icon icon="angle-left" size="3x"/></mdb-btn>
				<mdb-btn tag="a" floating size="sm" class="mt-0" v-else="navBarCurrentItem > navBarMinItem" disabled><mdb-icon icon="angle-left" size="3x" class="grey-text"/></mdb-btn>
				<div class="h3 mt-1"> Record {{ selectedRecordIndex }} of {{ selectedUserAllocation.pending }} remaining records</div>
				<mdb-btn tag="a" @click="getNewRecord(selectedRecordIndex+1)" floating size="sm" class="mt-0" v-if="selectedRecordIndex < selectedUserAllocation.pending" ><mdb-icon icon="angle-right" size="3x"/></mdb-btn>
				<mdb-btn tag="a" floating size="sm" class="mt-0" v-else disabled><mdb-icon icon="angle-right" size="3x"  class="grey-text"/></mdb-btn>
				<mdb-btn tag="a" @click="getNewRecord(selectedUserAllocation.pending)" floating size="sm" class="mt-0" v-if="selectedRecordIndex < selectedUserAllocation.pending"><mdb-icon icon="angle-double-right" size="3x"/></mdb-btn>
				<mdb-btn tag="a" floating size="sm" class="mt-0" v-else disabled><mdb-icon icon="angle-double-right" size="3x"  class="grey-text"/></mdb-btn>
			</mdb-card-header>
			<card-body class="grey-text recordMetaData">
				<form
					id="recordMetadataForm"
					ref="recordMetadataForm"
					class="needs-validation"
					@keydown="stopRKey()"
					@submit.prevent="trySaveRecordDetails"
				>
					<div class="mt-2">
						<label class="mb-0 mr-5 ml-5" for="qcFlag" aria-label="Select a QC Flag">QC Flag</label>
						<select
							class="custom-select"
							id="qcFlag"
							label="qcFlag"
							name="qcFlag"
							required
							@change="updateRecordQcFlag"
						>
							<option
								v-for="listItem in qcFlagValues"
								:selected="listItem.id == formValues.recordQcFlag"
								:value="listItem.id"> {{listItem.name}}</option>
						</select>
						<div class="invalid-tooltip">Select a QC Flag.</div>
					</div>
					<div v-if="formValues.recordQcFlag === 3" class="mt-3">
						<label class="mb-0 mr-4" for="failureReason" aria-label="Select reason for failure">Reason for Failure</label>
						<select
							id="failureReason"
							class="custom-select"
							label="failureReason"
							name="failureReason"
							@change="updateFailureReason"
							required>
							<option value="">{{failureOption}}</option>
							<option
								v-for="reason in failureReasons"
								:selected="reason.id == formValues.failureReason"
								:value="reason.id"> {{reason.name}}
							</option>
						</select>
						<div class="invalid-tooltip">Select a Failure Reason.</div>
					</div>
					<div class="mt-3">
						<label class="mb-0 sr-only" for="notes" aria-label="QC Notes">Notes</label>
						<mdb-input type="textarea" :value='formValues.notes' @change="updateNotes" id="notes" label="QC Notes" icon="pencil-alt" :required="formValues.recordQcFlag === 3"/>
						<div class="invalid-tooltip">Notes on a failed record are required.</div>
					</div>
				</form>
			</card-body>
		</card>
	</div>
</template>

<script lang="ts">
import store from '@/store/index'
import {eventBus} from '../../main'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import Multiselect from 'vue-multiselect'
import {Btn, Card, CardBody, Column, mdbCardFooter, mdbTextarea, mdbContainer, mdbCardHeader, mdbDatePicker, mdbBadge, mdbInput, mdbChip, mdbBtn, Icon, mdbIcon,mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter,} from 'mdbvue'
import notify from '@/helpers/notification'
import Component from 'vue-class-component'
import Vue from 'vue'


// @Component({})
// export  default class AllocationForm extends Vue {
//
// }

export default {
	name: 'RecordMetaDataForm',
	components: {
		Card,
		CardBody,
		mdbCardHeader,
		mdbCardFooter,
		Column,
		Btn,
		Multiselect,
		mdbDatePicker,
		mdbBadge,
		mdbInput,
		mdbChip,
		mdbBtn,
		mdbTextarea,
		Icon,
		mdbIcon,
		mdbContainer,
		mdbModal,
		mdbModalHeader,
		mdbModalTitle,
		mdbModalBody,
		mdbModalFooter,
	},
	data() {
		return {
			view: 'Records',
			dataChangedFlag: false,
			continueAnyway: false,
			showDataChangedModal: false,
			recordNavVal: null,
			dataChangedTitle: 'Form Data Has Been Changed',
			dataChangedText: 'Data on this page has been changed. If you leave this page without submitting the form you will loose any changes you may have made to this record.',
			failureOption: 'Select a reason for failure',
			formValues: {
				detailId: null,
				recordQcFlag: 1,
				failureReason: false,
				notes: '',
			},
			navBarMaxItem: 0,
			navBarMinItem: 1,
			navBarCurrentItem: this.selectedRecordIndex,
			navBarDeactivated: 'color:gray',
			navBarActivated: 'color:white',
			totalRemainingRecords: null,
			currentRecordIndex: this.selectedRecordIndex,
			gridRef: 'recordReviewGrid',
		}
	},
	computed: {
		...mapGetters([
			'getUser',
			'recordsList',
			'qcFlagValues',
			'qualityFlagValues',
			'failureReasons',
			'selectedAllocation',
			'selectedUserAllocation',
			'selectedUserAllocationId',
			'selectedAllocationCount',
			'selectedUserAllocationDetails',
			'unallocatedRecordsGridColumnDefs',
			'selectedRecordId',
			'selectedRecord',
			'selectedRecordIndex',
			'recordVersion',
		]),
	},
	created() {

		eventBus.$on('pageDataChanged', (dataChanged) => {
			if(dataChanged.view === this.view) {
				this.dataChangedFlag = dataChanged.dirty
				if(!dataChanged.dirty) {
					this.clearRecordLevelForm()
					this.getNewRecord(this.selectedRecordIndex)
				}
			}
		})
		eventBus.$on('submitRecordQcForm', (currentRecordIndex) => {
			this.clearRecordLevelForm()
			this.getNewRecord(currentRecordIndex)
		})
		// get the index of the selected record for working with the pagination on the toolbar
		this.updateSelectedRecordIndex(this.selectedRecordId)
		// get the record details for the grid
		this.fetchDatasetDetailRecord(this.selectedRecordId, 1)
		this.initRecordMetadataFormValues(this.formValues)
		this.fetchDocumentsByDetailId(this.selectedRecordId)
	},
	methods: {
		...mapActions([
			'fetchDatasetDetailRecord',
			'fetchAllocationDetailsById',
			'getQcFlagValues',
			'getQualityFlagValues',
			'getFailureReasons',
			'pushAllocation',
			'updateSelectedRecord',
			'updateSelectedRecordId',
			'fetchAllocationDetailsById',
			'updateSelectedRecordIndex',
			'updateRecordMetadataFormValues',
			'fetchDocumentsByDetailId',
			'clearSelectedRecord',
		]),
		initRecordMetadataFormValues() {
			this.updateRecordMetadataFormValues(this.formValues)
		},
		cancel(ev) {
			ev.preventDefault()
		},
		clearRecordLevelForm() {
			this.showDataChangedModal = false
			this.dataChangedFlag = false
			this.formValues.failureReason = null
			this.formValues.recordQcFlag = 1
			this.formValues.notes = ''
			const formData = {
				version: null,
				recordQcFlag: this.formValues.recordQcFlag,
				detailId: null,
				failureReason: this.formValues.failureReason,
				notes: this.formValues.notes,
			}
			this.updateRecordMetadataFormValues(formData)
		},
		markDataChanged(dirty) {
			const dataChanged = {
				view: 'Records',
				dirty: dirty,
			}
			eventBus.$emit('pageDataChanged', dataChanged)
		},
		continueNavigation(ev) {
			this.clearRecordLevelForm()
			this.getNewRecord(this.recordNavVal)
		},
		getNewRecord(val) {
			// console.log('index passed to getNewRecord', val)
			//	console.log('selectedUserAllocationId in getNewRecord', this.selectedUserAllocationId)
			if(this.dataChangedFlag && !this.continueAnyway) {
				this.showDataChangedModal = true
				this.recordNavVal = val
			}
			else {
				this.clearRecordLevelForm()
				let record_id = this.getRecordIdFromIndex(val)
				// console.log('recordid from getRecordIdFromIndex(val)', record_id)
				this.clearSelectedRecord()
				this.fetchDatasetDetailRecord(record_id)
				this.fetchDocumentsByDetailId(record_id)
				this.recordNavVal = null
			}
		},
		getRecordIdFromIndex(idx) {
			const newSelectedRecord = this.selectedUserAllocationDetails.find((item) => {
				return	item.index === idx
			})
			// console.log('newSelectedRecord in getRecordIdFromIndex: ', newSelectedRecord)
			const newId = newSelectedRecord.datasetDetailsId
			this.updateSelectedRecord(newSelectedRecord)
			this.updateSelectedRecordId(newId)
			this.updateSelectedRecordIndex(newId)
			return newId
		},

		updateRecordQcFlag(event) {
			this.formValues.recordQcFlag = parseInt(event.target.value)
			if (this.formValues.recordQcFlag != 1) {
				this.markDataChanged(true)
			}
			// clear the selected form info
			const formData = {
				version: this.recordVersion,
				recordQcFlag: this.formValues.recordQcFlag,
				detailId: this.selectedRecordId,
				failureReason: this.formValues.failureReason,
				notes: this.formValues.notes,
			}
			this.updateRecordMetadataFormValues(formData)
		},
		updateFailureReason(event) {
			if (parseInt(event.target.value) == 'NaN') {
				this.formValues.failureReason = 0
			} else {
				this.formValues.failureReason = parseInt(event.target.value)
			}
			const formData = {
				version: this.recordVersion,
				recordQcFlag: this.formValues.recordQcFlag,
				detailId: this.selectedRecordId,
				failureReason: this.formValues.failureReason,
				notes: this.formValues.notes,
			}
			this.updateRecordMetadataFormValues(formData)
		},
		updateNotes(value) {
			if (this.formValues.notes.length > 0) {
				this.markDataChanged(true)
			}
			this.formValues.notes = value
			const formData = {
				version: this.recordVersion,
				recordQcFlag: this.formValues.recordQcFlag,
				detailId: this.selectedRecordId,
				failureReason: this.formValues.failureReason,
				notes: this.formValues.notes,
			}
			this.updateRecordMetadataFormValues(formData)

		},

		clearSelections() {
			this.formValues.failureReason = null
			this.formValues.recordQcFlag = 1
			this.formValues.notes = ''
		},
		trySaveQcData(event) {
			event.preventDefault();
			event.target.classList.add('was-validated')
			if (this.selectedAllocationCount < 1) {
				notify.error({message: 'Please select at least 1 record', position:'bottom center', timeOut: 5000})
				return false
			} else if (this.selectedValues.qcDate.date == '') {
				notify.error({message: 'Please select a QC by date', position:'bottom center', timeOut: 5000})
				return false
			}
			event.target.classList.remove('was-validated')
			const allocationObj = {
				datasetId: this.selectedValues.datasetId,
				reviewerId: this.selectedValues.reviewer,
				dueDate: this.selectedValues.qcDate.date,
				records: this.selectedAllocation,
				createBy: parseInt(this.getUser.id)
			}
			// call this to create a allocation
			this.saveAllocation(allocationObj).then( (response) => {
				if(response) {
					console.log(JSON.parse(response.data))
					notify.success({message: 'Allocation saved successfully', position:'bottom right', timeOut: 5000})
					// this.fetchAllocations()
				} else {
					notify.error({message: response, position:'bottom right', timeOut: 5000})
				}
				this.clearSelections()
			})
		},
		stopRKey() {
			if (event.keyCode === 13) {
				event.stopPropagation()
				event.stopImmediatePropagation()
				event.preventDefault()
				return false
			}
		},
	},
}
</script>
<style src='vue-multiselect/dist/vue-multiselect.min.css'></style>

<style lang="scss" scoped>
.spinnerZ {
	display: block;
	position: absolute;
	z-index: 300;
	padding-left: 8rem;
	padding-top: 2rem;
}
.card-cascade {
	width: 320px
}
select.custom-select{
	display: inline-block !important;
	width: 35%;
}
.md-form label {
	color: #a2a2a2 !important;
}
.invalid-tooltip {
	position: relative
}
</style>
