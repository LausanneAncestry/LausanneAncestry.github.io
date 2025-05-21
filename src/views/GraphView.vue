<template>
  <div class="chart-container">
    <h2 class="chart-title">
      Professional Responsibilities
    </h2>
    <h3 class="chart-subtitle">
      of the 2nd Generation relative to those of the 1st Generation
    </h3>
    <svg class="chart" ref="svgRef"></svg>
  </div>
  <div class="chart-container">
    <h2 class="chart-title">
      Training Duration
    </h2>
    <h3 class="chart-subtitle">
      of the 2nd Generation relative to those of the 1st Generation
    </h3>
    <svg class="chart" ref=""></svg>
  </div>
  <div class="chart-container">
    <h2 class="chart-title">
      Job Physicality
    </h2>
    <h3 class="chart-subtitle">
      of the 2nd Generation relative to those of the 1st Generation
    </h3>
    <svg class="chart" ref=""></svg>
  </div>
</template>


<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, inject, type Ref } from 'vue'
import * as d3 from 'd3'
import type { DataMap } from '@/utils/person';

const data = inject<Ref<DataMap>>('data');
if (!data) {
  throw new Error('data not provided');
}

const persons_ = data.value.persons
const jobs = data.value.jobs

interface Person {
  id: string
  job?: string
  job_hierarchy?: 'worker' | 'boss'
  year_appear: number
  father_job?: string
  father_job_hierarchy?: 'worker' | 'boss'
}

//made up data for testing:
const persons: Person[] = [
  { id: 'p1', job: 'Factory Owner', job_hierarchy: 'boss', year_appear: 1835, father_job: 'Blacksmith', father_job_hierarchy: 'worker' },
  { id: 'p2', job: 'Clerk', job_hierarchy: 'worker', year_appear: 1835, father_job: 'Merchant', father_job_hierarchy: 'boss' },
  { id: 'p3', job: 'Farmer', job_hierarchy: 'worker', year_appear: 1835, father_job: 'Farmer', father_job_hierarchy: 'worker' },
  { id: 'p4', job: 'Merchant', job_hierarchy: 'boss', year_appear: 1855, father_job: 'Farmer', father_job_hierarchy: 'worker' },
  { id: 'p5', job: 'Factory Worker', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Factory Owner', father_job_hierarchy: 'boss' },
  { id: 'p6', job: 'Blacksmith', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Blacksmith', father_job_hierarchy: 'worker' },
  { id: 'p7', job: 'Bank Manager', job_hierarchy: 'boss', year_appear: 1875, father_job: 'Clerk', father_job_hierarchy: 'worker' },
  { id: 'p8', job: 'Farmer', job_hierarchy: 'worker', year_appear: 1875, father_job: 'Farmer', father_job_hierarchy: 'worker' },
  { id: 'p9', job: 'Merchant', job_hierarchy: 'boss', year_appear: 1875, father_job: 'Merchant', father_job_hierarchy: 'boss' },
  { id: 'p10', job: 'Factory Worker', job_hierarchy: 'worker', year_appear: 1890, father_job: 'Factory Worker', father_job_hierarchy: 'worker' },
  { id: 'p11', job: 'Factory Owner', job_hierarchy: 'boss', year_appear: 1890, father_job: 'Factory Worker', father_job_hierarchy: 'worker' },
  { id: 'p12', job: 'Clerk', job_hierarchy: 'worker', year_appear: 1890, father_job: 'Bank Manager', father_job_hierarchy: 'boss' },
  { id: 'p13', job: 'Baker', job_hierarchy: 'worker', year_appear: 1835, father_job: 'Baker', father_job_hierarchy: 'worker' },
  { id: 'p14', job: 'Lawyer', job_hierarchy: 'boss', year_appear: 1835, father_job: 'Clerk', father_job_hierarchy: 'worker' },
  { id: 'p15', job: 'Teacher', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Teacher', father_job_hierarchy: 'worker' },
  { id: 'p16', job: 'Doctor', job_hierarchy: 'boss', year_appear: 1855, father_job: 'Doctor', father_job_hierarchy: 'boss' },
  { id: 'p17', job: 'Shoemaker', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Shoemaker', father_job_hierarchy: 'worker' },
  { id: 'p18', job: 'Innkeeper', job_hierarchy: 'boss', year_appear: 1875, father_job: 'Farmer', father_job_hierarchy: 'worker' },
  { id: 'p19', job: 'Carpenter', job_hierarchy: 'worker', year_appear: 1875, father_job: 'Carpenter', father_job_hierarchy: 'worker' },
  { id: 'p20', job: 'Printer', job_hierarchy: 'worker', year_appear: 1875, father_job: 'Printer', father_job_hierarchy: 'worker' },
  { id: 'p21', job: 'Bank Manager', job_hierarchy: 'boss', year_appear: 1890, father_job: 'Bank Manager', father_job_hierarchy: 'boss' },
  { id: 'p22', job: 'Butcher', job_hierarchy: 'worker', year_appear: 1890, father_job: 'Butcher', father_job_hierarchy: 'worker' },
  { id: 'p23', job: 'Merchant', job_hierarchy: 'boss', year_appear: 1835, father_job: 'Farmer', father_job_hierarchy: 'worker' },
  { id: 'p24', job: 'Tailor', job_hierarchy: 'worker', year_appear: 1835, father_job: 'Tailor', father_job_hierarchy: 'worker' },
  { id: 'p25', job: 'Doctor', job_hierarchy: 'boss', year_appear: 1835, father_job: 'Teacher', father_job_hierarchy: 'worker' },
  { id: 'p26', job: 'Lawyer', job_hierarchy: 'boss', year_appear: 1855, father_job: 'Lawyer', father_job_hierarchy: 'boss' },
  { id: 'p27', job: 'Baker', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Innkeeper', father_job_hierarchy: 'boss' },
  { id: 'p28', job: 'Shopkeeper', job_hierarchy: 'boss', year_appear: 1855, father_job: 'Shopkeeper', father_job_hierarchy: 'boss' },
  { id: 'p29', job: 'Mason', job_hierarchy: 'worker', year_appear: 1875, father_job: 'Mason', father_job_hierarchy: 'worker' },
  { id: 'p30', job: 'Apothecary', job_hierarchy: 'boss', year_appear: 1875, father_job: 'Clerk', father_job_hierarchy: 'worker' },
  { id: 'p31', job: 'Farmer', job_hierarchy: 'worker', year_appear: 1890, father_job: 'Merchant', father_job_hierarchy: 'boss' },
  { id: 'p32', job: 'Blacksmith', job_hierarchy: 'worker', year_appear: 1890, father_job: 'Blacksmith', father_job_hierarchy: 'worker' },
  { id: 'p32', job: 'Blacksmith', job_hierarchy: 'worker', year_appear: 1890, father_job: 'Blacksmith', father_job_hierarchy: 'worker' },
  { id: 'p33', job: 'Shopkeeper', job_hierarchy: 'boss', year_appear: 1835, father_job: 'Carpenter', father_job_hierarchy: 'worker' },
  { id: 'p34', job: 'Tailor', job_hierarchy: 'worker', year_appear: 1835, father_job: 'Tailor', father_job_hierarchy: 'worker' },
  { id: 'p35', job: 'Bank Manager', job_hierarchy: 'boss', year_appear: 1835, father_job: 'Clerk', father_job_hierarchy: 'worker' },
  { id: 'p36', job: 'Farmer', job_hierarchy: 'worker', year_appear: 1835, father_job: 'Merchant', father_job_hierarchy: 'boss' },
  { id: 'p37', job: 'Carpenter', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Carpenter', father_job_hierarchy: 'worker' },
  { id: 'p38', job: 'Doctor', job_hierarchy: 'boss', year_appear: 1855, father_job: 'Doctor', father_job_hierarchy: 'boss' },
  { id: 'p39', job: 'Factory Worker', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Factory Owner', father_job_hierarchy: 'boss' },
  { id: 'p40', job: 'Baker', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Innkeeper', father_job_hierarchy: 'boss' },
  { id: 'p41', job: 'Lawyer', job_hierarchy: 'boss', year_appear: 1855, father_job: 'Lawyer', father_job_hierarchy: 'boss' },
  { id: 'p42', job: 'Teacher', job_hierarchy: 'worker', year_appear: 1855, father_job: 'Teacher', father_job_hierarchy: 'worker' },
  { id: 'p43', job: 'Printer', job_hierarchy: 'worker', year_appear: 1875, father_job: 'Printer', father_job_hierarchy: 'worker' },
  { id: 'p44', job: 'Butcher', job_hierarchy: 'worker', year_appear: 1875, father_job: 'Butcher', father_job_hierarchy: 'worker' },
  { id: 'p45', job: 'Innkeeper', job_hierarchy: 'boss', year_appear: 1875, father_job: 'Farmer', father_job_hierarchy: 'worker' },
  { id: 'p46', job: 'Apothecary', job_hierarchy: 'boss', year_appear: 1875, father_job: 'Clerk', father_job_hierarchy: 'worker' },
  { id: 'p47', job: 'Shoemaker', job_hierarchy: 'worker', year_appear: 1875, father_job: 'Shoemaker', father_job_hierarchy: 'worker' },
  { id: 'p48', job: 'Merchant', job_hierarchy: 'boss', year_appear: 1890, father_job: 'Merchant', father_job_hierarchy: 'boss' },
  { id: 'p49', job: 'Factory Owner', job_hierarchy: 'boss', year_appear: 1890, father_job: 'Factory Worker', father_job_hierarchy: 'worker' },
  { id: 'p50', job: 'Clerk', job_hierarchy: 'worker', year_appear: 1890, father_job: 'Bank Manager', father_job_hierarchy: 'boss' },
]

const yCategories = [
  'higher',
  'identical',
  'lower'
] as const

type YCategory = typeof yCategories[number]

function responsibilityCategory(p: Person): YCategory {
  if (p.job_hierarchy === 'boss' && p.father_job_hierarchy === 'worker') return 'higher'
  if (p.job_hierarchy === 'worker' && p.father_job_hierarchy === 'boss') return 'lower'
  return 'identical'
}
function responsibilityValue(p: Person): number {
  if (p.job_hierarchy === 'boss' && p.father_job_hierarchy === 'worker') return 1
  if (p.job_hierarchy === 'worker' && p.father_job_hierarchy === 'boss') return -1
  return 0
}

const svgRef = ref<SVGSVGElement | null>(null)

function drawChart(years: any) {
  // --- Prepare Data ---
  const data = persons.map(p => ({
    ...p,
    resp_category: responsibilityCategory(p),
    resp_value: responsibilityValue(p)
  }))

  const container = svgRef.value?.parentElement
  if (!container) return

  const containerWidth = container.clientWidth
  const containerHeight = 450 // or container.clientHeight if you want dynamic height

  const margin = { top: 40, right: 40, bottom: 60, left: 220 }
  const width = containerWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom

  // --- Scales ---
  const x = d3.scaleLinear()
    .domain([1800, 1900])
    .range([0, width])

  const y = d3.scalePoint<YCategory>()
    .domain(yCategories)
    .range([0, height])
    .padding(0.5)

  // --- SVG Setup ---
  const svg = d3.select(svgRef.value)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');


  svg.selectAll('*').remove() // Clear previous

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // --- Axes ---
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(years).tickFormat(d3.format('d')))
  g.append('g')
    .call(d3.axisLeft(y))

  // --- Axis Labels ---
  svg.append('text')
    .attr('x', margin.left + width / 2)
    .attr('y', height + margin.top + 45)
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .attr('font-weight', 'bold')
    .text('Year')

  svg.append('text')
    .attr('x', margin.left - 160)
    .attr('y', margin.top + height / 2)
    .attr('text-anchor', 'middle')
    .attr('transform', `rotate(-90,${margin.left - 160},${margin.top + height / 2})`)
    .attr('font-size', 14)
    .attr('font-weight', 'bold')
    .text('Responsibility relative to 1st generation')

  // --- Jitter helpers ---
  function jitterY() { return (Math.random() - 0.5) * 30 }
  function jitterX() { return (Math.random() - 0.5) * 30 }

  // --- Color ---
  const color = d3.scaleOrdinal<YCategory, string>()
    .domain(yCategories)
    .range(['#2ca02c', '#1f77b4', '#d62728'])

  // --- Tooltip ---
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background', '#fff')
    .style('border', '1px solid #bbb')
    .style('padding', '6px 12px')
    .style('border-radius', '6px')
    .style('pointer-events', 'none')
    .style('font-size', '13px')
    .style('color', '#222')
    .style('box-shadow', '2px 2px 8px #ccc')

  // --- Draw Points ---
  g.selectAll('.person')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'person')
    .attr('cx', d => x(d.year_appear) + jitterX())
    .attr('cy', d => y(d.resp_category)! + jitterY())
    .attr('r', 4)
    .attr('fill', d => color(d.resp_category))
    .attr('stroke', '#333')
    .attr('stroke-width', 1.5)
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      tooltip.transition().duration(150).style('opacity', 1)
      tooltip.html(
        `<strong>Job:</strong> ${d.job} (${d.job_hierarchy})<br>
        <strong>Father's job:</strong> ${d.father_job} (${d.father_job_hierarchy})`
      )
        .style('left', (event.pageX + 18) + 'px')
        .style('top', (event.pageY - 28) + 'px')
      d3.select(this).attr('stroke-width', 3)
    })
    .on('mousemove', function (event) {
      tooltip.style('left', (event.pageX + 18) + 'px')
        .style('top', (event.pageY - 28) + 'px')
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0)
      d3.select(this).attr('stroke-width', 1.5)
    })

  // --- Error Bars ---
  function yFromMean(mean: number) {
    // -1: lower, 0: identical, 1: higher
    const y0 = y('lower')!
    const y1 = y('identical')!
    const y2 = y('higher')!
    return d3.scaleLinear().domain([-1, 0, 1]).range([y0, y1, y2])(mean)
  }

  const yearStats = years.map((year: any) => {
    const vals = data.filter(p => p.year_appear === year).map(p => p.resp_value)
    const mean = vals.length ? d3.mean(vals) ?? 0 : 0
    const std = vals.length ? d3.deviation(vals) ?? 0 : 0
    return { year, mean, std }
  })

  g.selectAll('.error-bar')
    .data(yearStats)
    .enter()
    .append('line')
    .attr('class', 'error-bar')
    .attr('x1', (d: any) => x(d.year))
    .attr('x2', (d: any) => x(d.year))
    .attr('y1', (d: any) => yFromMean(d.mean - d.std))
    .attr('y2', (d: any) => yFromMean(d.mean + d.std))
    .attr('stroke', '#222')
    .attr('stroke-width', 2)

  g.selectAll('.mean-dot')
    .data(yearStats)
    .enter()
    .append('circle')
    .attr('class', 'mean-dot')
    .attr('cx', (d: any) => x(d.year))
    .attr('cy', (d: any) => yFromMean(d.mean))
    .attr('r', 6)
    .attr('fill', '#222')
}

onMounted(() => {
  const years = [1835, 1855, 1875, 1890]
  drawChart(years)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', drawChart)
})

</script>

<style scoped>
.tooltip {
  z-index: 1000;
}

.chart-container {
  width: 100%;
  max-width: 1200px;
  margin: 0px 32px;
  padding: 24px 0;
}

.chart-title {
  text-align: left;
  font-size: 2.2rem;
  font-weight: bold;

  margin-top: 0;
}

.chart-subtitle {
  text-align: left;
  font-size: 1rem;
  margin-bottom: 32px;
}

.chart {
  width: 100%;
  height: 450px;
  display: block;
}
</style>