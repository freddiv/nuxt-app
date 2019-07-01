<template>
	<ag-grid-vue ref="recordAllocationGrid" v-bind:style="gridSize"
		class="ag-theme-balham"
		:rowData="unallocatedRecordsList"
		:rowDataChanged="onDataChanged"
		:defaultColDef="defaultColDef"
		:gridOptions="gridOptions"
		:columnDefs="unallocatedRecordsGridColumnDefs"
		@model-updated="onDataChanged"
		@data-changed="onDataChanged"
		@first-data-rendered="onDataChanged"
		@cell-clicked="onCellClicked"
		:suppressRowClickSelection="true"
		:sortable="true"
		@selection-changed="onSelectionChanged"
		:filter="true"
		rowSelection="multiple"
		pagination="true"
		:paginationPageSize="paginationPageSize"
		:overlayLoadingTemplate="overlayLoadingTemplate"
    	:overlayNoRowsTemplate="overlayNoRowsTemplate"
		@grid-ready="onGridReady"
		@row-selected="onRowSelected"/>
</template>

<script>
import {eventBus} from '../../main'
import {AgGridVue} from 'ag-grid-vue'
import {mapActions, mapGetters} from 'vuex'

const GRID_KEY = 'recordAllocationGrid-config'
const gridStore = {
	fetch() {
		var savedGridConfig = JSON.parse(localStorage.getItem(GRID_KEY)) || ''
		return savedGridConfig
	},
	save(gridConfig) {
		localStorage.setItem(GRID_KEY, gridConfig)
	},
}

export default {
	name: 'RecordAllocationGrid',
	components: {
		AgGridVue,
	},
	data() {
		return {
			paginationPageSize: 100,
			selectedRecords: [],
			gridSize: {
				width: '540px',
				height: '580px',
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
			userGridConfig: gridStore.fetch(GRID_KEY) || '',
		}
	},
	computed: {
		...mapGetters(['recordsList', 'unallocatedRecordsList', 'unallocatedRecordsGridColumnDefs']),
		gridRef() {
			return this.gridApi
		},

	},
	watch: {
		userGridConfig: {
			handler(userGridConfig) {
				// console.log('saved userGridConfig watch')
				gridStore.save(userGridConfig)
			},
			deep: true,
		},
	},
	beforeMount() {
		this.gridOptions = {};
		this.overlayLoadingTemplate =
			'<div class="ag-overlay-loading-center ag-overlay-record-grid" style="padding: 10px; border: 0px solid lightgoldenrodyellow;"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div> <br> Please wait while we load your records</div>'
		this.overlayNoRowsTemplate =
			'<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No records to display.</span>'
	},
	mounted() {
		this.gridApi = this.gridOptions.api
		this.gridColumnApi = this.gridOptions.columnApi
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
		this.gridApi.sizeColumnsToFit()
	},
	created() {
		// console.log(this.recordsList)
		eventBus.$emit('toolbarSetPageSize', this.paginationPageSize)
		eventBus.$on('toolbarFilter', (str) => {
			this.onQuickFilterChanged(str)
		})
		eventBus.$on('toolbarSelectAll', () => {
			this.onToolbarSelectAll()
		})
		eventBus.$on('toolbarClearSelections', () => {
			this.onToolbarClearSelection()
		})
		eventBus.$on('toolbarSetPageSize', (size) => {
			this.onToolbarSetPageSize(size)
		})
		eventBus.$on('gridShowLoading', (grid) => {
			if (grid === 'recordAllocationGrid') {
				this.onGridShowLoading()
			}
		})
	},
	methods: {
		...mapActions(['fetchDatasetRecords', 'updateSelectedRecordsForAllocation']),
		parseRow(item) {
			const selectedNodes = []
			if (item) {
				selectedNodes.push(item)
				const selectedData = selectedNodes.map(node => node.data)
				const mappedData = selectedData[0]
				const columnObj = this.gridRef.columnController.columnDefs.slice(0)
				const mapped = columnObj.map(function(column) {
					var field = column.field
					column.val = mappedData[field]
					return column
				})
				return mapped
			}
			return item
		},
		onGridShowLoading() {
			this.gridApi.showLoadingOverlay()
		},
		handleResize() {
			this.gridOptions.api.sizeColumnsToFit()
		},
		onGridReady(params) {
			this.gridComponent = this.$refs.recordAllocationGrid
			this.gridApi = params.api
			this.columnApi = params.columnApi
		},
		onDataChanged(params) {
			this.gridApi = params.api
			if (this.unallocatedRecordsList.length > 0){
				this.gridApi.hideOverlay();
				this.handleResize()
			}
		},
		onSelectionChanged() {
			this.selectedRecords = []
			this.getPageDisplayedRows()
		},
		getSelectedRows() {
			const selectedNodes = this.gridApi.getSelectedNodes()
			const selectedData = selectedNodes.map(node => node.data)
			const selectedDataStringPresentation = selectedData.map(node => node.id + ' ' + node.email).join(', ')
		},
		onQuickFilterChanged(fieldVal) {
			this.gridApi.setQuickFilter(fieldVal)
		},
		onToolbarSetPageSize(size) {
			this.paginationPageSize = size
			this.gridApi.paginationSetPageSize(size)
		},
		onToolbarSelectAll() {
			this.gridApi.deselectAll()
			this.gridApi.selectAllFiltered()
			const selectedRecords = this.gridApi.getSelectedRows()
			// console.log(selectedRecords)
			this.getPageDisplayedRows()
		},
		onToolbarClearSelection() {
			this.gridApi.deselectAll()
			this.selectedRecords = []
			this.getPageDisplayedRows()
		},

		getPageDisplayedRows() {
			const rowCount = this.gridApi.getDisplayedRowCount()
			const lastGridIndex = rowCount - 1
			const currentPage = this.gridApi.paginationGetCurrentPage()
			const pageSize = this.gridApi.paginationGetPageSize()
			const startPageIndex = currentPage * pageSize;
			let endPageIndex = ((currentPage + 1) * pageSize) - 1

			if (endPageIndex > lastGridIndex) {
				endPageIndex = lastGridIndex
			}

			for (let i = startPageIndex; i<=endPageIndex; i++) {
				let rowNode = this.gridApi.getDisplayedRowAtIndex(i)
				if (rowNode.selected) {
					this.selectedRecords.push(rowNode.data.datasetDetailsId)
				}
			}
			this.updateSelectedRecordsForAllocation(this.selectedRecords)
		},
		onCellClicked(params) {
			if (params.colDef.field === 'id') {
			}
		},
		onRowSelected(event) {
			const selectedNodes = this.gridApi.getSelectedNodes()
		},
	},
}

</script>

<style scoped>

.ag-overlay-record-grid {
	width:60% !important;
}
</style>
