<template>
	<div class="tree-container">
		<svg ref="svgRef"></svg>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import type { Person } from '@/utils/person';

interface TreeNode {
	name: string;
	children?: TreeNode[];
}

const props = defineProps<{ person: Person | undefined }>();
const svgRef = ref<SVGSVGElement | null>(null);

function buildTreeData(person: Person): TreeNode {
	return {
		name: `${person.first_name} ${person.last_name} ${person.job}`,
		children: person.children.map(buildTreeData),
	};
}

function drawTree() {
	if (!svgRef.value || !props.person) return;
	const data = buildTreeData(props.person);

	const width = 500; // Increased width for scrollability
	const height = 800; // Increased height for scrollability
	const treeLayout = d3.tree<TreeNode>().size([width - 200, height - 200]);
	const root = d3.hierarchy<TreeNode>(data);
	treeLayout(root);

	const svg = d3.select(svgRef.value)
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', `0 0 ${width} ${height}`)
		.attr('preserveAspectRatio', 'xMidYMid meet');

	// Clear previous content before drawing
	svg.selectAll('*').remove();

	const g = svg.append('g')
		.attr('transform', 'translate(100,100)');

	g.selectAll('.link')
		.data(root.links())
		.enter().append('line')
		.attr('class', 'link')
		.attr('stroke', 'black')
		.attr('x1', d => d.source.x)
		.attr('y1', d => d.source.y)
		.attr('x2', d => d.target.x)
		.attr('y2', d => d.target.y);

	g.selectAll('.node')
		.data(root.descendants())
		.enter().append('circle')
		.attr('class', 'node')
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.attr('r', 5)
		.attr('fill', 'blue');

	g.selectAll('.label')
		.data(root.descendants())
		.enter().append('text')
		.attr('class', 'label')
		.attr('x', d => d.x + 10)
		.attr('y', d => d.y)
		.text(d => d.data.name);
}

onMounted(drawTree);
watch(() => props.person, drawTree, { deep: true });
</script>

<style scoped>
.tree-container {
	width: 100vw;
	height: 100vh;
	overflow: auto;
	position: relative;
	border: 1px solid #ccc;
}

.link {
	stroke-width: 2px;
}
.node {
	stroke: #fff;
	stroke-width: 2px;
}
.label {
	font-size: 12px;
}
</style>