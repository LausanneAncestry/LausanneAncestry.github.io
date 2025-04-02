<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import { Person } from "@/utils/person";

const props = defineProps<{ person: Person | undefined }>();
const plotContainer = ref<HTMLElement | null>(null);

function drawTree(person: Person | undefined) {
	if (!person) return
	function getAllNestedPersons(person: Person, prefix: string): string[] {
		const name = `${person.first_name} ${person.last_name}\n${person.job}`
		const r = [prefix + name]
		person.children.forEach(children => {
			r.push(...getAllNestedPersons(children, prefix + name + "/"))
		})
		return r
	}

	const persons: string[] = getAllNestedPersons(person, "")

	const tree = Plot.plot({
		axis: null,
		height: 120,
		inset: 20,
		marginLeft: 100,
		insetLeft: 40,
		insetRight: 120,
		marks: [
			Plot.link(persons, Plot.treeLink({ stroke: "node:internal" })),
			Plot.dot(persons, Plot.treeNode({ fill: "node:internal" })),
			Plot.text(persons, Plot.treeNode({ text: "node:name", stroke: "white", fill: "currentColor", dx: 6, treeFilter: "node:external" })),
			Plot.text(persons, Plot.treeNode({ text: "node:name", stroke: "white", fill: "currentColor", textAnchor: "end", dx: -6, treeFilter: "node:internal" }))
		]
	})


	if (plotContainer.value) {
		plotContainer.value.innerHTML = ""
		plotContainer.value.appendChild(tree)
	}
}

onMounted(() => {
	if (props.person) drawTree(props.person)
})

watch(() => props.person, drawTree)
</script>

<template>
	<div ref="plotContainer"></div>
</template>
