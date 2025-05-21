<script setup lang="ts">
import FamilyTree from '@/components/FamilyTree.vue';
import type { Person, DataMap } from '@/utils/person';
import { inject, watch, type Ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import LazyFamilyTree from '@/components/LazyFamilyTree.vue';


const data = inject<Ref<DataMap>>('data');
const rootPersons = inject<Person[]>('rootPersons');
if (!rootPersons) {
  throw new Error('people not provided');
}

watch(rootPersons, (newValue, oldValue) => {
  console.log(data?.value.jobs)
})
</script>

<template>
  <main class="flex flex-col items-center gap-10">
    <h1 class="text-3xl font-bold mt-10">Arbres Généalogiques</h1>

    <p>Nombre d'arbres: {{ rootPersons.length }}</p>

    <div class="flex flex-wrap gap-16 m-8 justify-center">
      <LazyFamilyTree :root-person="person" v-for="person in rootPersons" />
    </div>

    
  </main>
</template>

<!-- nicolas.mermoud-graichy@epfl.ch -->