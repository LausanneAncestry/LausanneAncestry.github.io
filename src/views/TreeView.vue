<script setup lang="ts">
import * as d3 from "d3";
import * as Papa from "papaparse";

import { Person } from "@/utils/person";
import { ref } from "vue";
import FamilyTree from "@/components/FamilyTree.vue";

const CSV_URL = "tracked.csv"

async function fetchAndParseCSV(url: string): Promise<any[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const csvText = await response.text();
    const results = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });
    return results.data;
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    throw error;''
  }
}

const persons: { [key: string]: Person } = {};
const rootPersons = ref<Person[]>([]);
const selectedPerson = ref("")

fetchAndParseCSV(CSV_URL)
  .then((data) => {
    console.log('Parsed CSV data:', data);

		data.forEach(entry => {
			if (entry.pair_id === "") return

			let child = persons[entry.son_id]
			if (!child) {
				child = new Person(entry.son_id, entry.son_first_name, entry.son_last_name, entry.son_job, entry.father_id)
				persons[child.id] = child
			} else {
				child.parent = entry.father_id
			}

			let father = persons[entry.father_id]
			if (!father) {
				father = new Person(entry.father_id, entry.father_first_name, entry.father_last_name, entry.father_job)
				persons[father.id] = father
			}
			father.children.push(child)
		});
    rootPersons.value = Object.values(persons).filter(person => !person.parent)

    console.log(rootPersons.value.length)
  })
  .catch((error) => {
    console.error('Error:', error);
  });

</script>

<template>
  <main class="flex-col">
    <h1>Arbre Généalogique</h1>
    <select v-model="selectedPerson">
		  <option value="" disabled selected>Select person</option>
      <option v-for="person in rootPersons" :value=person.id>{{ person.first_name }} {{ person.last_name }} - {{ person.job }} - {{ person.children.length }} enfants</option>
	  </select>

    <FamilyTree :person="persons[selectedPerson]" /> 
  </main>
</template>
