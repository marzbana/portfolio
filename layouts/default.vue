<template>
  <div class="layout-wrapper">
    <!-- Header -->
    <header class="layout-header">
      <div class="container">
        <div class="header-content">
          <!-- Left: Logo -->
          <div class="header-left">
            <a href="/" class="logo-link" @click.prevent="goHome">
              <img 
                v-if="logoUrl" 
                :src="logoUrl" 
                alt="Site Logo" 
                class="logo-image"
              >
            </a>
          </div>

          <!-- Center: Gallery Title (only if on /galleries/:slug) -->
          <div class="header-center">
            <h1
              v-if="showGalleryTitle"
              class="gallery-page-title"
            >
              {{ galleryTitle }}
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="layout-main">
      <nuxt />
    </main>

    <!-- Footer -->
    <footer class="layout-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} My Photography Portfolio</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      logoUrl: null
    };
  },
  created() {
    this.fetchLogo();
  },
  computed: {
    showGalleryTitle() {
      return this.$route.name === "galleries-slug";
    },
    galleryTitle() {
      if (this.showGalleryTitle && this.$route.params.slug) {
        const slug = this.$route.params.slug;
        return slug.charAt(0).toUpperCase() + slug.slice(1);
      }
      return "";
    }
  },
  methods: {
    goHome() {
      window.location.href = "/";
    },
    async fetchLogo() {
      let baseURL = "";
      
      // When on the server, use the absolute URL for your hosted site.
      if (process.server) {
        baseURL = "https://alexislens.netlify.app";
      } else {
        // On the client, relative URLs work fine.
        baseURL = window.location.origin;
      }
      
      try {
        const response = await fetch(`${baseURL}/.netlify/functions/getImages?folder=logo`);
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          this.logoUrl = data.images[0].url;
        } else {
          console.warn('No logo found in folder "logo"');
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    }
  }
};
</script>

<style scoped>
/* Import desired fonts */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400;600&display=swap');

/* Layout wrapper: basic dark background, flex column */
.layout-wrapper {
  background-color: #111;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ---------------------- */
/* HEADER (Fixed Height)  */
/* ---------------------- */
.layout-header {
  background: linear-gradient(135deg, #222, #111);
  height: 80px; /* Fixed header height */
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

/* Container for consistent page width */
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header content spanning the header's height */
.header-content {
  display: flex;
  align-items: center; /* Vertically center everything */
  justify-content: flex-start; /* Logo left, title center */
  height: 100%; /* Match the header's height */
}

/* Left: The logo wrapper */
.header-left {
  flex: 0 0 auto; /* Only take as much space as needed */
}

/* Logo link styles */
.logo-link {
  text-decoration: none;
  display: inline-block;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.logo-link:hover {
  opacity: 0.8;
}

/* ----------------------------------- */
/* LOGO IMAGE - adjust 'height' freely */
/* ----------------------------------- */
.logo-image {
  /* Simply change the height below to resize the logo */
  height: 80px;
  width: auto;
  transition: opacity 0.3s ease;
}

/* Center: Title on gallery pages */
.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* The gallery page title */
.gallery-page-title {
  margin: 0;
  font-family: "Playfair Display", serif;
  font-size: 2.5rem;
  letter-spacing: 2px;
  color: #fff;
}

/* Main content: leaves space for fixed header */
.layout-main {
  flex: 1;
  padding-top: 80px; /* At least match the header height so content isn't hidden */
  padding-bottom: 60px;
}

/* Footer */
.layout-footer {
  background: #000;
  padding: 2rem 0;
  text-align: center;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 0.9rem;
  border-top: 1px solid #222;
  position: relative;
  z-index: 1000;
}

/* ------------- */
/* MEDIA QUERIES */
/* ------------- */
@media (max-width: 768px) {
  .gallery-page-title {
    font-size: 2rem;
  }
  .layout-main {
    padding-top: 80px; /* same as header height */
  }
}

@media (max-width: 480px) {
  .gallery-page-title {
    font-size: 1.8rem;
  }
  .layout-main {
    padding-top: 80px; /* same as header height */
  }
}
</style>
