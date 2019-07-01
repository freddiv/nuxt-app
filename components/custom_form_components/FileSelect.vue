<template>
	<!--
	  Everything is wrapped in a label, which acts as a clickable wrapper around a form element.
	  In this case, the file input.
	-->
	<label class="file-select">
		<!-- We can't use a normal button element here, as it would become the target of the label. -->
		<div class="select-button">
			<!-- Display the filename if a file has been selected. -->
			<span>Select File</span>
		</div>
		<div v-if="showFileNotSupported" class="red-text font-weight-bolder">Selected file type is not supported.</div>
		<!-- Now, the file input that we hide. -->
		<input type="file" @change="handleFileChange"/>
	</label>
</template>
<script>
import { mdbTabs } from 'mdbvue'
export default {
	props: {
		// Using value here allows us to be v-model compatible.
		value: File,
		validFileTypes: Array,
	},
	data() {
		return {
			showFileNotSupported: false,
		}
	},
	methods: {
		handleFileChange(e) {
			let  file_type_arr = e.target.files[0].type.split('/')
			let file_type = file_type_arr[file_type_arr.length-1]
			let is_valid_file = this.validFileTypes.find( (f_type) => {
				// console.log(f_type, ' == ', file_type)
				return f_type == file_type
			}) || false
			// Whenever the file changes, check for valid file type  and if valid emit the 'input' event with the file data.
			if(is_valid_file){
				this.showFileNotSupported = false
				this.$emit('input', e.target.files[0])
			}
			else {
				this.showFileNotSupported = true
				console.log('no good file type')
			}
		}
	}
}
</script>

<style scoped>
.file-select > .select-button {
	padding: 1rem;
	color: white;
	background-color: #3fa044;
	border-radius: 0.125rem;
	text-align: center;
	font-weight: bold;
}
/* Don't forget to hide the original file input! */
.file-select > input[type="file"] {
	display: none;
}
</style>