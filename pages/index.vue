<template>
  <div class="page" data-scroll-section>
    <!-- Hero Section: Split Screen with Parallax Effects -->
    <section class="hero h-screen flex">
      <!-- Left Section: Personal Info -->
      <div
        class="hero-left w-1/3 p-12 flex flex-col justify-center"
        data-scroll
        data-scroll-speed="1"
      >
        <h2 class="hero-title text-5xl font-extrabold mb-6 tracking-wider">
          Alexis Park
        </h2>
        <p class="hero-text text-lg mb-6 leading-relaxed">
          As a student passionate about photography, I invite you to explore my
          portfolio showcasing my unique perspective and creative journey. For
          inquiries, please reach out via email or connect with me on Instagram.
        </p>
        <div class="contact mb-6">
          <p class="text-lg">
            <a
              href="mailto:apark17@bu.edu"
              class="underline hover:text-purple-300 transition-colors"
              >apark17@bu.edu</a
            >
          </p>
        </div>
        <!-- Social Media Icon -->
        <div class="social flex space-x-4">
          <a
            href="https://instagram.com/flikkkks"
            target="_blank"
            data-scroll
            data-scroll-speed="1"
          >
            <img
              v-if="instagramIcon"
              :src="instagramIcon"
              alt="Instagram"
              class="w-8 h-8 rounded-full shadow-lg border-2 border-white"
            />
            <div
              v-else
              class="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full"
            >
              <span class="text-xs font-bold">IG</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Right Section: Full-Screen Cover Photo with Subtle Parallax -->
      <div
        class="hero-right w-2/3 overflow-hidden relative"
        data-scroll
        data-scroll-speed=""
      >
        <img
          v-if="coverPhoto"
          :src="coverPhoto"
          alt="Cover Photo"
          class="w-full h-full object-cover transform scale-105 transition-transform duration-1000 ease-out"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gray-800"
        >
          <p class="fallback-text text-gray-400">Loading cover photo...</p>
        </div>
      </div>
    </section>

    <!-- Galleries Section as Full-Screen Slides -->
    <section class="galleries">
      <!-- Each gallery slide takes up the full viewport -->
      <div
        v-for="gallery in galleries"
        :key="gallery.slug"
        class="gallery-slide h-screen relative clickable-slide"
        data-scroll
        data-scroll-speed="1"
        @click="goToGallery(gallery.slug)"
      >
        <img
          :src="gallery.coverImage"
          :alt="gallery.title"
          class="slide-image absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 ease-out"
        />
        <div class="slide-overlay absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 class="gallery-title text-5xl font-extrabold tracking-wider relative">
            <span class="title-text">{{ gallery.title }}</span>
          </h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  async asyncData({ req }) {
    let baseURL = "";
    if (process.server) {
      // When running on the server (during SSR or static generation), use the absolute URL.
      // You could also use an environment variable here.
      baseURL = "https://alexislens.netlify.app";
    } else {
      // When running in the browser, use window.location.origin.
      baseURL = window.location.origin;
    }
    try {
      const res = await fetch(`${baseURL}/.netlify/functions/getGalleries`);
      const data = await res.json();
      const galleries = data.galleries.map((gallery) => ({
        slug: gallery.galleryName,
        title:
          gallery.galleryName.charAt(0).toUpperCase() +
          gallery.galleryName.slice(1),
        folder: gallery.folder,
        coverImage: gallery.coverImage,
      }));
      return { galleries };
    } catch (error) {
      console.error("Error loading galleries:", error);
      return { galleries: [] };
    }
  },
  data() {
    return {
      coverPhoto: "",
      instagramIcon: "",
    };
  },
  mounted() {
    // These fetch calls run only on the client so relative URLs work fine.
    fetch("/.netlify/functions/getImages?folder=main")
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          this.coverPhoto = data.images[0].url;
        } else {
          console.warn('No cover photo found in folder "main".');
        }
      })
      .catch((error) =>
        console.error("Error fetching cover photo:", error)
      );

    fetch("/.netlify/functions/getImages?folder=instagram")
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          this.instagramIcon = data.images[0].url;
        } else {
          console.warn('No Instagram icon found in folder "instagram".');
        }
      })
      .catch((error) =>
        console.error("Error fetching Instagram icon:", error)
      );
  },
  methods: {
    goToGallery(slug) {
      this.$router.push(`/galleries/${slug}`);
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400;600&family=Montserrat:wght@700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  background-color: #111;
  color: #fff;
}

/* Hero Section */
.hero {
  overflow: hidden;
}

.hero-left {
  background-color: #111;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  letter-spacing: 2px;
  color: #fff;
}

.hero-text {
  font-family: 'Source Sans Pro', sans-serif;
  line-height: 1.6;
  color: #ccc;
}

.contact a {
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 600;
  color: #fff;
}

.social a img {
  border: 2px solid #fff;
}

.hero-right {
  position: relative;
}

.fallback-text {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.2rem;
}

/* Galleries Section */
.galleries {
  
}

.gallery-slide {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.clickable-slide {
  pointer-events: auto;
}

.slide-image {
  transition: transform 0.7s ease-out;
}

.slide-overlay {
  transition: opacity 0.5s ease-out;
}

/* Gallery Title Styling */
.gallery-title {
  font-family: 'Playfair Display', serif;
  color: #fff;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  transition: transform 0.3s ease-out;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.gallery-title .title-text::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 50%;
  background: currentColor;
  transition: all 0.3s ease-out;
  transform: translateX(-50%);
}

.gallery-title:hover .title-text::after {
  width: 100%;
}

.gallery-title:hover {
  transform: scale(1.03);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
  }
  .hero-left,
  .hero-right {
    width: 100%;
  }
  
  .gallery-title {
    font-size: 2.5rem;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .gallery-title {
    font-size: 2rem;
  }
}
</style>
