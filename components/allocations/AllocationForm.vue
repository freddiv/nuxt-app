<template>
	<div class="row justify-content-center">
		<column size="13" class="text-center mb-2">
			<card cascade class="text-left" style="height: 100%;">
				<form
					id="allocationForm"
					ref="allocationForm"
					class="needs-validation"
					@keydown="stopRKey()"
					@submit.prevent="trySaveAllocations"
				>
					<mdb-card-header class="primary-color white-text" >
						<h4 class="title">
							Allocate Records
						</h4>
					</mdb-card-header>
					<card-body class="grey-text">
						<div class="mt-2">
							<label class="mb-0" for="datasetName" aria-label="Select a dataset">Dataset</label>
							<select
								class="browser-default custom-select"
								id="datasetName"
								label="datasetName"
								name="datasetName"
								@change="updateSelectedDataset"
								required>
								<option value="">Select a list</option>
								<option
									v-for="listItem in datasetList"
									:selected="listItem == selectedValues.datasetId"
									:value="listItem.datasetId"> {{listItem.datasetName}}
								</option>
							</select>
							<div class="invalid-tooltip">Select a data set.</div>
						</div>
						<div class="mt-3">
							<div v-if="domainOption === 'Loading...'" class="d-flex justify-content-center spinnerZ">
								<div class="spinner-border text-primary" role="status">
									<span class="sr-only">Loading...</span>
								</div>
							</div>
							<label class="mb-0" for="domain" aria-label="Domain Select">Domain</label>
							<select
								id="domain"
								class="browser-default custom-select"
								label="domain"
								name="domain"
								@change="updateSelectedDomain"
								required>
								<option value="">{{domainOption}}</option>
								<option
									v-for="domain in domainsByDataset"
									:selected="domain.id == selectedValues.domainId"
									:value="domain.id"> {{domain.name}}
								</option>
							</select>
							<div class="invalid-tooltip">Select one Domain.</div>
						</div>
						<div class="mt-3">
							<label class="mb-0" for="reviewer" aria-label="Reviewer">Reviewers</label>
							<select
								id="reviewer"
								class="browser-default custom-select"
								label="reviewer"
								name="reviewer"
								@change="updateSelectedEmail"
								required>
								<option value="">Select a reviewer</option>
								<option
									v-for="reviewer in getUsersByDomain"
									:selected="reviewer.id == selectedValues.reviewer"
									:value="reviewer.id"> {{reviewer.email}}
								</option>
							</select>
							<div class="invalid-tooltip">Select a reviewer.</div>
						</div>
						<div class="mt-3">
							<label class="mb-0" for="source" aria-label="Select a Source">Sources</label>
							<select
								id="source"
								class="browser-default custom-select"
								label="source"
								name="source"
								@change="updateSelectedSource">
								<option value="">Select a source</option>
								<option
									v-for="source in sourcesByDataset"
									:selected="source.id == selectedValues.sourceId"
									:value="source.id"> {{source.name}}
								</option>
							</select>
							<div class="invalid-tooltip">Select a Source </div>
						</div>
						<div class="mt-3">
							<mdb-btn color="primary">
								<span class="font-weight-bold">
									<i class="far fa-file-excel mr-2 h5" />{{selectedRecordsForAllocation.length }}
									Records Selected
									<mdb-badge color="danger-color" class="ml-2">{{ selectedRecordsForAllocation.length }}</mdb-badge>
								</span>
							</mdb-btn>

							<div class="invalid-tooltip">Select at least 1 record to assign</div>
						</div>
						<div class="mt-3">
							<mdb-date-picker :date="selectedValues.qcDate" :option="datePickerOpts" @getValue="getQcDate"></mdb-date-picker>
							<div class="invalid-tooltip">Select a QC by date </div>
						</div>
					</card-body>
					<mdb-card-footer>
						<btn color="warning" @click.native="cancel">Cancel</btn>
						<btn color="green"> Save </btn>
						<!--<mdb-btn gradient="purple" floating size="lg"><mdb-icon icon="bolt"/></mdb-btn>-->
					</mdb-card-footer>
				</form>
			</card>
		</column>
	</div>
</template>

<script lang="ts">
import store from '@/store/index'
import {eventBus} from '../../main'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import Multiselect from 'vue-multiselect'
import {Btn, Card, CardBody, Column, mdbCardFooter, mdbCardHeader, mdbDatePicker, mdbBadge, mdbChip, mdbBtn, mdbIcon} from 'mdbvue'
import notify from '@/helpers/notification'
import Component from 'vue-class-component'
import Vue from 'vue'


// @Component({})
// export  default class AllocationForm extends Vue {
//
// }

export default {
	name: 'AllocationForm',
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
		mdbChip,
		mdbBtn,
		mdbIcon,
	},
	data() {
		return {
			domainOption: 'Select a domain',
			gridRef: 'recordAllocationGrid',
			selectedValues: {
				datasetId: 0,
				domainId: 0,
				sourceId: '',
				reviewer: '',
				records: [],
				qcDate: '',
				selectedRecords: '',
				qcDate: {
					date: '',
				},
			},
			datePickerOpts: {
				type: 'day',
				week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				format: 'YYYY-MM-DD',
				placeholder: 'Select a QC by date',
				inputStyle: {
					'display': 'inline-block',
					'padding': '6px',
					'line-height': '22px',
					'font-size': '16px',
					'border': '2px solid #fff',
					'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
					'border-radius': '2px',
					'color': '#5F5F5F'
				},
				color: {
					header: 'primary',
					headerText: 'white',
					checkedDay: 'primary'
				},
				buttons: {
					ok: 'Ok',
					cancel: 'Cancel'
				}
			}
		}
	},
	computed: {
		...mapGetters([
			'getUser',
			'datasetList',
			'recordsList',
			'selectedRecordsForAllocation',
			'getUsersByDomain',
			'domainsByDataset',
			'sourcesByDataset',
			'selectedAllocationCount',
			'unallocatedRecordsGridColumnDefs',
		]),
	},
	created() {
		this.fetchDatasetList()
		this.fetchDatasetRecords()
		this.filterUsersByDomain()
	},
	methods: {
		...mapActions([
			'fetchUsers',
			'filterUsersByDomain',
			'fetchDomains',
			'fetchSources',
			'fetchDatasetList',
			'fetchDatasetRecords',
			'fetchUnallocatedDatasetDetails',
			'saveAllocation',
			'clearAllocationsFormData',
			'clearDatasetList',
			'updateSelectedRecordsForAllocation',
			'fetchUnallocatedDatasetCount',
		]),
		cancel(ev) {
			ev.preventDefault()
			const eventData = {
				selectedModule: 'Allocations',
				selectedView: 'AllocationGrid',
			}
			eventBus.$emit('showForm', eventData)
		},
		updateSelectedDataset(value) {
			this.selectedValues.datasetId = value.target.value
			// clear the selected form info
			this.selectedValues.domainId = ''
			this.selectedValues.sourceId = ''
			this.selectedValues.reviewer = ''

			const formData = {
				datasetId: this.selectedValues.datasetId,
			}
			this.domainOption='Loading...'

			this.fetchUnallocatedDatasetCount(formData).then(() => {
				this.domainOption='Select a domain'
			})

		},
		updateSelectedDomain(value) {
			this.selectedValues.domainId = value.target.value
			const formData = {
				datasetId: this.selectedValues.datasetId,
				domainId: this.selectedValues.domainId,
			}
			eventBus.$emit('gridShowLoading', this.gridRef)
			this.fetchUnallocatedDatasetDetails(formData).then(() => {
			})
			this.filterUsersByDomain(this.selectedValues.domainId)
		},
		updateSelectedSource(value) {
			this.selectedValues.sourceId = value.target.value
			eventBus.$emit('gridShowLoading', this.gridRef)
			const formData = {
				datasetId: this.selectedValues.datasetId,
				domainId: this.selectedValues.domainId,
				sourceId: this.selectedValues.sourceId,
			}
			this.fetchUnallocatedDatasetDetails(formData)

		},
		updateSelectedEmail(value) {
			this.selectedValues.reviewer = value.target.value
		},
		getQcDate(value) {
			this.selectedValues.qcDate.date = value

		},
		clearSelections() {
			this.selectedValues  = {
				datasetId: 0,
				domainId: 0,
				sourceId: '',
				reviewer: '',
				records: [],
				qcDate: '',
				selectedRecords: '',
				qcDate: {
					date: '',
				},
			}
			this.clearAllocationsFormData()
			this.clearDatasetList()
			this.fetchDatasetList()
			this.updateSelectedRecordsForAllocation()
		},
		trySaveAllocations(event) {

			event.preventDefault();
			event.target.classList.add('was-validated')
			if (this.selectedRecordsForAllocation.length < 1) {
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
				records: this.selectedRecordsForAllocation,
				createBy: parseInt(this.getUser.id)
			}
			// call this to create a allocation
			this.saveAllocation(allocationObj).then( (response) => {
				if(response) {
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
<style scoped>
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

.invalid-tooltip {
	position: relative
}
</style>
