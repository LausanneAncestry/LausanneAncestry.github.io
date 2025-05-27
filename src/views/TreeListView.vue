<script setup lang="ts">
import FamilyTree from '@/components/FamilyTree.vue';
import type { Person } from '@/utils/person';
import { computed, inject, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const rootPersons = inject<Ref<Person[]>>('rootPersons');
if (!rootPersons) {
  throw new Error('people not provided');
}

const route = useRoute();
const router = useRouter();

const ITEMS_PER_PAGE = 20;

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(rootPersons.value.length / ITEMS_PER_PAGE);
});

// Get current page from query or default to 1
const currentPage = computed(() => {
  const page = Number(route.query.page);
  return isNaN(page) || page < 1 || page > totalPages.value ? 1 : page;
});

// Store the input field value
const inputPage = ref(currentPage.value);

// Slice the persons to display on the current page
const paginatedPersons = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return rootPersons.value.slice(start, start + ITEMS_PER_PAGE);
});

// Navigate to a different page
function goToPage(page: number) {
  router.push({ query: { ...route.query, page: clampPage(page) } });
}

function clampPage(page: number): number {
  return Math.max(1, Math.min(totalPages.value, page));
}
</script>

<template>
  <main class="flex flex-col items-center gap-10">
    <h1 class="text-3xl font-bold mt-10">Arbres Généalogiques</h1>

    <p>Nombre d'arbres: {{ rootPersons.length }}</p>

    <div class="flex flex-wrap gap-16 m-8 justify-center">
      <FamilyTree :root-person="person" v-for="person in paginatedPersons" :key="person.id" />
    </div>

    <div class="flex flex-wrap gap-4 items-center justify-center my-4">
      <!-- Previous Button -->
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
        class="cursor-pointer px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        Précédent
      </button>

      <!-- Page Input Field -->
      <div class="flex items-center gap-2">
        <span>Page</span>
        <input v-model.number="inputPage" @keydown.enter="goToPage(inputPage)" type="number" :min="1" :max="totalPages"
          class="w-16 text-center border rounded px-2 py-1" />
        <span>sur {{ totalPages }}</span>
      </div>

      <!-- Next Button -->
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages"
        class="cursor-pointer px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        Suivant
      </button>
    </div>
  </main>
</template>
