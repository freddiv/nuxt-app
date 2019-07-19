<template>
	<div class="container-fluid mt-5">
		A single user with id {{ $route.params.id}}
	</div>
</template>

<script>
export default {
    name: 'User',
    validate (data) {
        console.log(data)
        const validated = /^\d+$/.test(data.params.id)
        if (validated) {
           return true 
        }
        //console.log(error)
        return false
    }
}
</script>