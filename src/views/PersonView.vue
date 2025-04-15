<script setup lang="ts">
import FamilyTree from '@/components/FamilyTree.vue';
import type { CensusEntry, Person, PersonMap } from '@/utils/person';
import { computed } from '@vue/reactivity';
import { inject, ref, type Ref } from 'vue';


const props = defineProps<{
	id: string
}>()

const persons = inject<Ref<PersonMap>>('persons');
const person = computed(() => persons?.value[props.id])

</script>

<template>
	<div class="flex flex-col gap-9 m-8" v-if="person">
		<h1 class="text-xl font-bold">{{ person.name }}#{{ person.id }}</h1>
		<RouterLink :to="{ name: 'person', params: { id: person.parentId } }" v-if="person.parentId">
			<h3 class="underline">Lien vers le parent</h3>
		</RouterLink>
		<div class="overflow-x-auto shadow-md rounded-lg">
			<table class="min-w-full bg-white">
				<thead class="bg-gray-800 text-white">
					<tr>
						<th class="py-3 px-6 text-left" v-for="key in Object.keys(person.censusEntries[0])">{{ key }}
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					<tr class="hover:bg-gray-100" v-for="entry in person.censusEntries">
						<td class="py-4 px-6" v-for="value in Object.values(entry)">{{ value }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="flex justify-center w-full">
			<FamilyTree :root-person="person" />
		</div>
	</div>
</template>