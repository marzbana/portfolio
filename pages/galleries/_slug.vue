<template>
  <client-only>
    <div data-scroll-section class="gallery-page">
      <!-- Removed the old .gallery-header section 
           because we don’t want a second banner. -->

      <!-- Gallery Images Section -->
      <section class="gallery-images container mx-auto pt-20 pb-12">
        <!-- Scroll container for Locomotive Scroll -->
        <div class="gallery-slider" data-scroll-container>
          <!-- Loop over the imageGroups -->
          <div
            v-for="(group, groupIndex) in imageGroups"
            :key="groupIndex"
            data-scroll
          >
            <!-- Vertical Image Pair -->
            <div
              v-if="group.type === 'vertical-pair'"
              class="flex gap-4 mb-8"
            >
              <div
                v-for="(img, imgIndex) in group.images"
                :key="img.public_id"
                class="gallery-slide relative flex items-center justify-center clickable-slide w-1/2"
              >
                <img
                  :src="img.url"
                  :alt="img.public_id"
                  class="slide-image"
                />
              </div>
            </div>

            <!-- Single Image -->
            <div
              v-else
              class="gallery-slide relative flex items-center justify-center mb-8 clickable-slide"
            >
              <img
                :src="group.image.url"
                :alt="group.image.public_id"
                class="slide-image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </client-only>
</template>

<script>
export default {
  async asyncData({ params, error }) {
    const folder = `gallery_${params.slug}`;
    try {
      const res = await fetch(`/.netlify/functions/getImages?folder=${folder}`);
      const data = await res.json();
      return {
        gallery: {
          title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
          description: ""
        },
        images: data.images || []
      };
    } catch (err) {
      return error({ statusCode: 500, message: "Error fetching gallery images" });
    }
  },
  computed: {
    imageGroups() {
      const groups = [];
      let i = 0;

      while (i < this.images.length) {
        const current = this.images[i];
        const isVertical = current.height > current.width;

        if (isVertical) {
          const next = this.images[i + 1];
          if (next && next.height > next.width) {
            groups.push({
              type: 'vertical-pair',
              images: [current, next]
            });
            i += 2;
          } else {
            groups.push({
              type: 'single',
              image: current
            });
            i++;
          }
        } else {
          groups.push({
            type: 'single',
            image: current
          });
          i++;
        }
      }
      return groups;
    }
  },
  mounted() {
    // Only run LocomotiveScroll in the browser
    if (process.client) {
      this.$nextTick(() => {
        import('locomotive-scroll').then((module) => {
          const LocomotiveScroll = module.default;
          this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 1, // Adjust if you want faster/slower scrolling
            smartphone: { smooth: true },
            tablet: { smooth: true },
          });
        });
      });
    }
  },
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.destroy();
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400;600&display=swap');

.gallery-page {
  background-color: #111;
  color: #fff;
  min-height: 100vh;
}

/* We removed the .gallery-header styling 
   because we display the title in the layout now */

.slide-image {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
  transition: transform 0.5s ease-out;
  transform-origin: center center;
}

.slide-image:hover {
  transform: scale(1.05);
}

[data-scroll-container] {
  min-height: 100vh;
}

/* Responsive styling */
@media (max-width: 768px) {
  .gallery-images {
    padding-top: 6rem; /* some top padding so images aren’t hidden by the fixed header */
  }

  .gallery-slider .flex.gap-4 {
    flex-direction: column;
  }

  .gallery-slider .flex.gap-4 .gallery-slide {
    width: 100% !important;
  }
}
</style>
