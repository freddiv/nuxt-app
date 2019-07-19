<template>
	<div style="width: 100%; height:90%;">
		<mdb-container  v-if="showConfirmation">
			<mdb-modal @close="showConfirmation = false">
				<mdb-modal-header>
					<mdb-modal-title>{{confirmationTitle}}</mdb-modal-title>
				</mdb-modal-header>
				<mdb-modal-body>
					<p>{{confirmationText}} </p>
					<div v-if="showGridValidation">
						<p class="h6">{{ gridValidationText }}</p>
						<i v-for="item in gridValidationMessage" class="fas fa-1x fa-exclamation red-text mr-4 "><span class="h5 grey-text ml-3">{{ item.text }}</span></i>
					</div>
				</mdb-modal-body>
				<mdb-modal-footer>
					<mdb-btn color="yellow" @click.native="cancel()"> Cancel </mdb-btn>
					<btn color="green"  v-if="showSubmit === true" class="float-right" @click.native="submitRecord()"> Submit Record </btn>
				</mdb-modal-footer>
			</mdb-modal>
		</mdb-container>
		<ag-grid-vue v-if="selectedRecord" ref="CheckRecordGrid" v-bind:style="gridSize"
			class="ag-theme-balham"
			:gridOptions="gridOptions"
			:rowData="selectedRecord"
			:defaultColDef="defaultColDef"
			:columnDefs="IcolumnDefs"
			singleClickEdit="true"
			@model-updated="onModelUpdated"
			@first-data-rendered="onModelUpdated"
			@selection-changed="onSelectionChanged"
			@cell-focused="onCellFocused"
			@grid-ready="onGridReady"
			@cell-clicked="onCellClicked"
			@cell-editing-stopped="cellEditingStopped"
			:suppressRowClickSelection="false"
			:sorting="true"
			:filter="true"
			rowSelection="single" />
		<card cascade class="text-left" style="height: 5rem;">
			<mdb-card-footer>
				<btn color="green" class="float-right" @click="prepareFormSubmit()"> Save </btn>
			</mdb-card-footer>
		</card>
	</div>
</template>

<script>
import {eventBus} from '@/main'
import {AgGridVue} from 'ag-grid-vue'
import { mdbContainer, Btn, Card, mdbCardFooter,mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn,} from 'mdbvue'
import router from '@/router'
import {mapActions, mapGetters, mapState} from 'vuex'
import EditUserLink from '@/cell_renderers/EditUserLink'
import RenderRowFlag from '@/cell_renderers/RenderRowFlag'
import RenderListArray from '@/cell_renderers/RenderListArray'
import RenderTrashLink from '@/cell_renderers/RenderTrashLink'
import RenderReviewLink from '@/cell_renderers/RenderReviewLink'
import RenderObjArray from '@/cell_renderers/RenderObjArray'

import notify from '@/helpers/notification'


export default {
	name: 'CheckRecordGrid',
	components: {
		AgGridVue,
		EditUserLink,
		RenderRowFlag,
		RenderListArray,
		RenderObjArray,
		RenderTrashLink,
		RenderReviewLink,
		Card,
		mdbCardFooter,
		Btn,
		mdbContainer,
		mdbModal,
		mdbModalHeader,
		mdbModalTitle,
		mdbModalBody,
		mdbModalFooter,
		mdbBtn,
	},
	data () {
		return {
			formToValidate: '',
			showConfirmation: false,
			showSubmit: false,
			defaultConfirmationTitle: 'Verify Record QC Submission',
			defaultConfirmationText:  'Are you sure you want to submit this record. You will not be able to return to this record and make any changes after it has been submitted.',
			confirmationTitle: 'Verify Record QC Submission',
			confirmationText:  'Are you sure you want to submit this record. You will not be able to return to this record and make any changes after it has been submitted.',
			showGridValidation: false,
			gridValidationText: 'You must verfify the record QC data before you can submit the form.',
			gridDataChanged: false,
			gridValidationMessage: [],
			updatedGridData: [],
			currentFlagValue: '',
			gridSize: {
				width: '100%',
				minWidth: '120px',
				height: '75%',
				overflow: 'hidden'
			},
			defaultColDef: {
				width: 100,
				editable: false,
				sortable: true,
				resizable: true,
				filter: true,
			},
			gridOptions: null,
			gridApi: null,
			columnApi: null,
			gridComponent: '',
			detailRowHeight: null,
			detailCellRenderer: null,
			frameworkComponents: null,
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
			'selectedAllocationCount',
			'selectedUserAllocationDetails',
			'unallocatedRecordsGridColumnDefs',
			'selectedRecordId',
			'selectedRecord',
			'recordMetadataFormValues',
			'selectedRecordIndex',
			'selectedUserAllocationId',
		]),
		IcolumnDefs() {
			const defs = [ {
				headerName: "Type",
				field: "type",
				hide: false,
				filter: "agTextColumnFilter",
				editable: false,
				width: 60
			}, {
				headerName: "Value",
				field: "value",
				tooltipField: "name",
				hide: false,
				filter: false,
				editable: false,
				width: 120
			}, {
				headerName: "Flag",
				field: "flag",
				editable: true,
				cellRendererFramework: 'RenderRowFlag',
				cellEditor: "agRichSelectCellEditor",
				cellEditorParams: {
					values: ["Pass", "Change"],
					cellRendererFramework: 'RenderRowFlag',
				},
				hide: false,
				filter: false,
				width: 80
			}, {
				headerName: "New Value",
				field: "newValue",
				hide: false,
				filter: false,
				width: 80
			}]
			return defs
		},
	},
	created() {
		// console.log(this.selectedUserAllocationId)
	},
	beforeMount() {
		this.gridOptions = {}
	},
	mounted() {
		this.gridApi = this.gridOptions.api;
		this.gridColumnApi = this.gridOptions.columnApi;
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
		this.formToValidate = document.getElementById('recordMetadataForm')
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		...mapActions([
					'fetchDatasetRecords',
					'fetchAllocations',
					'fetchUserAllocations',
					'pushAllocation',
					'fetchAllocationDetailsById',
					'fetchDatasetDetailRecord',
					'updateDatasetDetailRecord',
					'clearSelectedRecord',
					'clearRecordMetadataFormValues',
		]),
		onGridReady(params) {
			this.gridApi = params.api
			this.gridApi.sizeColumnsToFit()
		},
		handleResize() {
			// console.log(this.gridOptions)
			if(this.gridOptions.api) {
				this.gridOptions.api.sizeColumnsToFit()
			}
		},
		cellEditingStopped(params) {
		//	console.log(params.column.colDef.field)
			this.markDataChanged(true)
			if(params.column && params.column.colDef.field === 'flag') {
				if(params.column) {
					this.currentFlagValue = params.value
					this.gridOptions.api.tabToNextCell()
				} else {
					params.column.colDef.editable = false
				}
			}
		},
		onCellFocused(params) {
			if(params.column && params.column.colDef.field === 'newValue') {
				if(this.currentFlagValue === 'Change') {
					params.column.colDef.editable = true
					//this.gridOptions.api.startEditingCell('newValue')
				} else {
					params.column.value = ''
					params.column.colDef.editable = false
				}
			}
		},
		onCellClicked(params) {
			const selectedAllocation = this.gridApi.getSelectedRows()[0]
		},
		onModelUpdated(params) {
			this.handleResize()
		},
		onSelectionChanged(params) {
			this.gridApi = params.api
		},
		cancel() {
			this.showConfirmation = false
			this.showSubmit = false
		},
		markDataChanged(dirty) {
			const dataChanged = {
				view: 'Records',
				dirty: dirty == true ? true : false,
			}
			eventBus.$emit('pageDataChanged', dataChanged)
		},
		clearRecordFormData() {
			this.markDataChanged(false)
			this.clearRecordMetadataFormValues()
			this.showSubmit = false
			this.showConfirmation = false
			this.gridValidationMessage =[]
			this.updatedGridData = []
			this.gridDataChanged = false
		},
		prepareFormSubmit(ev) {
			this.showSubmit = false
			this.showConfirmation = false
			this.validateGridData()
			this.validateRecordLevelData()
			this.formToValidate.classList.add('was-validated')
		},
		validateGridData() {
			this.gridDataChanged = false
			const updatedData = []
			this.gridValidationMessage =[]
			this.gridApi.stopEditing()
			this.gridApi.forEachNode(  (rowNode, index) => {
				const data = rowNode.data
				if(data.flag != null && data.flag != 'Pass') {
					this.gridDataChanged = true
					if(data.newValue == null) {
						let newMessageItem ={
							row: index,
							text: `The ${data.type} has been flagged as changed but no new value has been assigned`
						}
						data.flag = 'change'
						this.gridValidationMessage.push(newMessageItem)

					} else {

					}
				}
				updatedData.push(data)
			})
			this.updatedGridData = JSON.parse(JSON.stringify(updatedData))
		},
		validateRecordLevelData() {
			switch (this.recordMetadataFormValues.recordQcFlag) {
				case 1:
					this.confirmationTitle = 'This Record Has Been Marked as "Pending"'
					this.confirmationText = `You cannot save a record as pending. You must mark a record as Pass, Fail, or Changed to save a record.`
					this.showConfirmation = true
					this.showSubmit = false
					break
				case 2:
					this.confirmationTitle = 'This Record Has Been Marked as "Pass"'
					if(!this.gridDataChanged) {
						this.confirmationText = this.defaultConfirmationText
						this.showConfirmation = true
						this.showSubmit = true
					} else {
						this.confirmationText = `There have been data changes made in the QC Record. You must select "Changed" in the QC Flag menu.`
						this.showConfirmation = true
						this.showSubmit = false
					}
					break
				case 3:
					this.confirmationTitle = 'This Record Has Been Marked as "Failed"'
					if (this.recordMetadataFormValues.failureReason < 1) {
						this.confirmationText = `You cannot save a record as failed without selecting a reason for failure and a QC Note. Please select a reason you failed the record and enter a note.`
						if (this.recordMetadataFormValues.notes.length <= 1) {
							this.showConfirmation = true
							this.showSubmit = false
						}
					} else {
						if (this.recordMetadataFormValues.notes.length <= 1) {
							this.confirmationText = `You cannot save a record as failed without a QC Note. Please enter a notation for this record.`
							this.showConfirmation = true
							this.showSubmit = false
						} else {
							this.confirmationText = this.defaultConfirmationText
							this.showConfirmation = true
							this.showSubmit = true
						}
					}
					break
				case 4:
					this.confirmationTitle = 'This Record Has Been Marked as "Changed"'
					if(this.gridDataChanged) {
						this.confirmationText = this.defaultConfirmationText
						this.showConfirmation = true
						this.showSubmit = true
					} else {
						this.confirmationText = `There have not been changes made in the QC Record. You must make changes to the QC data or select a different option in the QC Flag menu.`
						this.showConfirmation = true
						this.showSubmit = false
					}
					break

				default:
					this.confirmationTitle = this.defaultConfirmationTitle
					this.confirmationText = this.defaultConfirmationText
					this.showConfirmation = true
					this.showSubmit = true
			}
			if (this.gridValidationMessage.length > 0) {
				// console.log(this.gridValidationMessage)
				this.showConfirmation = true
				this.showGridValidation = true
				this.showSubmit = false
			}
		},
		submitRecord() {
			const recordLevelFormData = {
				version: this.recordMetadataFormValues.version,
				datasetDetailsId: this.recordMetadataFormValues.detailId,
				qcStatusId: this.recordMetadataFormValues.recordQcFlag,
				annotation: this.recordMetadataFormValues.notes
			}
			if(this.recordMetadataFormValues.failureReason) {
				recordLevelFormData.failureReasonId = this.recordMetadataFormValues.failureReason
			}
			if(this.gridDataChanged) {
				var submitObject = {
					data: this.updatedGridData,
					recordLevel: recordLevelFormData
				}
			} else {
				var gridData = []
				var submitObject = {
					data: gridData,
					recordLevel: recordLevelFormData
				}
			}
			const selectedAllocationId =  this.selectedUserAllocationId
			// console.log('selectedAllocationId in submit: ', selectedAllocationId)
			const currentRecordIndex = this.selectedRecordIndex
			this.updateDatasetDetailRecord(submitObject).then( (data) => {
				const updatedRecord = data
				this.formToValidate.classList.remove('was-validated')
				// console.log('selectedAllocationId in callback: ', selectedAllocationId)
				this.fetchUserAllocations(selectedAllocationId).then( ()=> {
					const params={
						allocationId: selectedAllocationId,
						statusId: 1,
					}
				this.fetchAllocationDetailsById(params).then( () => {
						this.clearRecordFormData()
						eventBus.$emit('submitRecordQcForm', currentRecordIndex)
						notify.success({message: 'Record QC submitRecord saved successfully', position:'bottom right', timeOut: 5000})
					})
				})
			}).catch( () => {
				notify.error({message: 'Error Saving Record QC. Please try again.', position:'bottom right', timeOut: 5000})
			})
		},
	},
}

</script>

<style lang="scss" scoped>
.domains {
	margin: 4px 0px 1px 0px;
	padding: 5px 0px 5px 0px !important;
	display:block;
}
.listContainer {
	align-items: top;
	margin:  2px !important;
	width: 90%;
	height: 100%;
	overflow-y: auto;

	.badge {
		height:        15px;
		margin-bottom: 5px !important;
		padding-top:   4px;
		width:         95%;
	}
}
</style>