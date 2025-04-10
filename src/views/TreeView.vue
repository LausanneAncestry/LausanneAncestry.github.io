<script setup lang="ts">
import FamilyTree from '@/components/FamilyTree.vue';
import type { Person, PersonMap } from '@/utils/person';
import { inject, watch, type Ref } from 'vue';

const persons = inject<Ref<PersonMap>>('persons');
const rootPersons = inject<Person[]>('rootPersons');
if (!persons || !rootPersons) {
  throw new Error('people not provided');
}

// watch(rootPersons, (newValue, oldValue) => {
//   console.log(newValue)
// })
</script>

<template>
  <main class="flex flex-col items-center gap-10">
    <h1 class="text-3xl font-bold mt-10">Arbres Généalogiques</h1>

    <div class="flex flex-wrap gap-16 m-8 justify-center">
      <FamilyTree :root-person="person" v-for="person in rootPersons" />
    </div>
  </main>
</template>
