<template>
  <div data-scroll-section>
    <section class="container mx-auto p-4">
      <!-- Back Button -->
      <div class="mb-4">
        <nuxt-link to="/" class="text-purple-600 hover:underline">
          ← Back to Home
        </nuxt-link>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold">{{ gallery.title }}</h2>
        <p class="text-lg text-gray-600 mt-2">{{ gallery.description }}</p>
      </div>

      <!-- Gallery Images Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="overflow-hidden"
        >
          <img
            :src="img.url"
            :alt="img.public_id"
            class="w-full h-64 object-cover hover:scale-105 transform transition duration-300"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    // Fetch the galleries metadata from the Markdown file
    const contentData = await $content('galleries', 'index').fetch();
    // Find the gallery entry with the matching slug
    const gallery = (contentData.galleries || []).find(
      (g) => g.slug === params.slug
    );
    if (!gallery) {
      return error({ statusCode: 404, message: 'Gallery not found' });
    }
    try {
      // Use the gallery's folder to fetch images dynamically
      const res = await fetch(`/.netlify/functions/getImages?folder=${gallery.folder}`);
      const data = await res.json();
      return {
        gallery,
        images: data.images || []
      };
    } catch (err) {
      return error({ statusCode: 500, message: 'Error fetching gallery images' });
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
