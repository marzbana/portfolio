<template>
  <div data-scroll-section>
    <!-- Hero Section: Split Screen -->
    <section class="h-screen flex">
      <!-- Left Section: Personal Info -->
      <div class="w-1/3 bg-black text-white p-8 flex flex-col justify-center">
        <h2 class="text-4xl font-bold mb-4">Alexis Park</h2>
        <p class="mb-4">
          As a student passionate about photography, I invite you to explore my portfolio showcasing my unique perspective and creative journey. For inquiries, please reach out via email or connect with me on Instagram.
        </p>
        <div class="mb-4">
          <p>
            <a href="mailto:apark17@bu.edu" class="underline">apark17@bu.edu</a>
          </p>
        </div>
        <!-- Social Media Icon: Instagram fetched dynamically -->
        <div class="flex space-x-4">
          <a href="https://instagram.com/flikkkks" target="_blank">
            <img 
              v-if="instagramIcon" 
              :src="instagramIcon" 
              alt="Instagram" 
              class="w-6 h-6" 
            />
            <div v-else class="w-6 h-6 flex items-center justify-center bg-gray-300">
              <span class="text-xs">IG</span>
            </div>
          </a>
        </div>
      </div>
  
      <!-- Right Section: Full-Screen Cover Photo from Cloudinary folder "main" -->
      <div class="w-2/3">
        <img 
          v-if="coverPhoto" 
          :src="coverPhoto" 
          alt="Cover Photo" 
          class="w-full h-full object-cover" 
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
          <p class="text-gray-700">Loading cover photo...</p>
        </div>
      </div>
    </section>
  
    <!-- Gallery Covers Section -->
    <section class="container mx-auto p-8">
      <h2 class="text-3xl font-bold text-center mb-8">Galleries</h2>
      <div class="space-y-8">
        <!-- Iterate through galleries loaded from the Markdown file -->
        <div
          v-for="(gallery, index) in galleries"
          :key="gallery.slug"
          class="relative group cursor-pointer"
          @click="goToGallery(gallery.slug)"
        >
          <img 
            :src="gallery.coverImage" 
            :alt="gallery.title" 
            class="w-full h-96 object-cover" 
          />
          <!-- Overlay label -->
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <span class="text-white text-2xl font-bold">{{ gallery.title }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  // Load the galleries metadata from the Markdown file using Nuxt Content
  async asyncData({ $content }) {
    const contentData = await $content('galleries', 'index').fetch();
    return {
      galleries: contentData.galleries || []
    }
  },
  data() {
    return {
      coverPhoto: "",       // URL for the cover photo from Cloudinary folder "main"
      instagramIcon: ""     // URL for the Instagram icon from Cloudinary folder "instagram"
    }
  },
  async mounted() {
    try {
      // Fetch the global cover photo from the "main" folder
      const coverRes = await fetch('/.netlify/functions/getImages?folder=main');
      const coverData = await coverRes.json();
      console.log('Fetched cover photo data:', coverData);
      if (coverData.images && coverData.images.length > 0) {
        this.coverPhoto = coverData.images[0].url;
      } else {
        console.warn('No cover photo found in folder "main".');
      }

      // Fetch the Instagram icon from the "instagram" folder
      const igRes = await fetch('/.netlify/functions/getImages?folder=instagram');
      const igData = await igRes.json();
      console.log('Fetched Instagram icon data:', igData);
      if (igData.images && igData.images.length > 0) {
        this.instagramIcon = igData.images[0].url;
      } else {
        console.warn('No Instagram icon found in folder "instagram".');
      }

      // For each gallery loaded from the content file, fetch its cover image dynamically
      const updatedGalleries = await Promise.all(
        this.galleries.map(async (gallery) => {
          const res = await fetch(`/.netlify/functions/getImages?folder=${gallery.coverImage}`);
          const data = await res.json();
          console.log(`Fetched data for gallery ${gallery.title}:`, data);
          if (data.images && data.images.length > 0) {
            // Replace the coverImage field with the URL from Cloudinary
            gallery.coverImage = data.images[0].url;
          } else {
            console.warn(`No images found for gallery folder "${gallery.coverImage}".`);
          }
          return gallery;
        })
      );
      // Update the galleries array
      this.galleries = updatedGalleries;
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  },
  methods: {
    goToGallery(slug) {
      this.$router.push(`/galleries/${slug}`);
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
