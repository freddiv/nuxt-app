<template>
	<div class="container-fluid">
    <ag-grid-vue style="width: 500px; height: 500px;"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="rowData">
    </ag-grid-vue>
    <div class="row">
        <div class="col-12">
        <input type="text" v-model="userId">
        <button @click="editUser">Go to user</button>
        </div>
     </div>  
    <nuxt-child />
    </div>
</template>

<script>
    import {AgGridVue} from "ag-grid-vue"

    export default {
        name: 'users',
        data() {
            return {
                columnDefs: null,
                rowData: null,
                userId: '',
            }
        },
        components: {
            AgGridVue
        },
        beforeMount() {
            this.columnDefs = [
                {headerName: 'Make', field: 'make'},
                {headerName: 'Model', field: 'model'},
                {headerName: 'Price', field: 'price'}
            ];

            this.rowData = [
                {make: 'Toyota', model: 'Celica', price: 35000},
                {make: 'Ford', model: 'Mondeo', price: 32000},
                {make: 'Porsche', model: 'Boxter', price: 72000}
            ];
        },
        layout: 'users',
        methods: {
            editUser() {
this.$router.push('/users/' + this.userId)
            },
        },
    }
</script>