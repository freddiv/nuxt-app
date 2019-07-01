<template>
	<ag-grid-vue ref="userGrid" v-bind:style="gridSize"
		class="ag-theme-balham"
		:gridOptions="gridOptions"
		:rowData="allUsers"
		:defaultColDef="defaultColDef"
		:columnDefs="userGridColumnDefs"
		@cell-clicked="onCellClicked"
		@row-selected="onRowSelected"
		@selection-changed="onRowSelected"
		:sorting="true"
		:filter="true"
		rowSelection="single"
		@grid-ready="onGridReady"/>
</template>

<script>
import {eventBus} from '../../main'
import {AgGridVue} from 'ag-grid-vue'
import {mapActions, mapGetters} from 'vuex'
import EditUserLink from '@/cell_renderers/EditUserLink'
import RenderIsActive from '@/cell_renderers/RenderIsActive'
import RenderListArray from '@/cell_renderers/RenderListArray'



const GRID_KEY = 'user-grid-config'
const gridStore = {
	fetch() {
		var saveduserGridConfig = JSON.parse(localStorage.getItem(GRID_KEY)) || ''
		return saveduserGridConfig
	},
	save(userGridConfig) {
		localStorage.setItem(GRID_KEY, userGridConfig)
	},
}

export default {
	name: 'UserGrid',
	components: {
		AgGridVue,
		EditUserLink,
		RenderIsActive,
		RenderListArray,
	},
	data() {
		return {
			gridSize: {
				width: '100%',
				height: '500px',
			},
			defaultColDef: {
				width: 100,
				editable: false,
				sortable: true,
				resizable: true,
				filter: true,
			},
			userId: 0,
			gridApi: null,
			columnApi: null,
			userGridConfig: gridStore.fetch(GRID_KEY) || '',
		}
	},
	computed: {
		...mapGetters(['allUsers', 'userGridColumnDefs']),
	},
	created() {
		eventBus.$on('toolbarFilter', (str) => {
			this.onQuickFilterChanged(str)
		})
	},
	beforeMount() {
		this.gridOptions = {};
	},
	mounted() {
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		...mapActions(['fetchUserGrid', 'addUser', 'fetchUsers']),
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
		handleResize() {
			this.gridOptions.api.sizeColumnsToFit()
		},
		onGridReady(params) {
			this.gridComponent = this.$refs.userGrid
			this.gridApi = params.api
			this.gridApi.sizeColumnsToFit()
			this.gridApi.redrawRows();
			this.columnApi = params.columnApi
		},
		getSelectedRows() {
			const selectedNodes = this.gridApi.getSelectedNodes()
			const selectedData = selectedNodes.map(node => node.data)
			const selectedDataStringPresentation = selectedData.map(node => node.id + ' ' + node.email).join(', ')
		},
		onQuickFilterChanged(fieldVal) {
			// console.log(fieldVal)
			this.gridOptions.api.setQuickFilter(fieldVal);
		},
		onCellClicked(params) {
			if (params.colDef.field === 'id') {
				const eventData = {
					userId: params.value,
					selectedView: 'UserForm',
				}
				eventBus.$emit('showUserForm', eventData)
			}
		},
		onRowSelected(event) {
			const selectedNodes = this.gridApi.getSelectedNodes()
		},
	},
}

</script>

<style scoped>
</style>
