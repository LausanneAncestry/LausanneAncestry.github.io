<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<header class="sticky top-0 z-50 bg-white shadow-md">
	<nav class="container mx-auto flex items-center justify-between p-4">
		<a href="#" class="text-xl font-bold">Meesa Navbar</a>
		<ul class="flex space-x-4">
      <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/tree">Tree Viewer</RouterLink>
        <RouterLink to="/about">About</RouterLink>
		</ul>
	</nav>
</header>

  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/tree">Tree Viewer</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

