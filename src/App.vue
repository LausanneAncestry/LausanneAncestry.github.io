<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, provide } from 'vue'
import { loadPersons, Person, type PersonMap } from './utils/person'

const persons = ref<PersonMap>({})
const rootPersons = ref<Person[]>([])
provide('persons', persons)
provide('rootPersons', rootPersons)

loadPersons().then(loadedPersons => {
  persons.value = loadedPersons
  rootPersons.value = Object.values(loadedPersons).filter(person => !person.parentId)
})
</script>

<template>
<header class="sticky top-0 z-50 bg-white shadow-md">
	<nav class="container mx-auto flex items-center justify-between p-4">
		<a href="#" class="text-xl font-bold">Lausanne Ancestry</a>
		<ul class="flex space-x-4">
      <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/tree">Tree Viewer</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/graph">Data Analysis</RouterLink>
		</ul>
	</nav>
</header>

  <RouterView />
</template>

