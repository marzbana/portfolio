<template>
  <div>
    <!-- Header -->
    <header class="bg-black text-white p-4">
      <div class="container mx-auto text-center">
        <nuxt-link to="/">
          <h1 class="text-3xl font-bold">Photography</h1>
        </nuxt-link>
      </div>
    </header>

    <!-- Main Content: Wrapped in a scroll container for Locomotive Scroll -->
    <main data-scroll-container>
      <nuxt />
    </main>

    <!-- Footer -->
    <footer class="bg-black text-white p-4 text-center">
      © {{ new Date().getFullYear() }} My Photography Portfolio
    </footer>
  </div>
</template>

<script>
export default {
  name: "DefaultLayout"
}
</script>

<style scoped>
/* Additional layout-specific styles can go here */
</style>
