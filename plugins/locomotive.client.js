// plugins/locomotive.client.js
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

export default ({ app }, inject) => {
  // Create a function to initialize Locomotive Scroll
  const initLocomotive = () => {
    const scrollContainer = document.querySelector('[data-scroll-container]')
    if (scrollContainer) {
      // Initialize Locomotive Scroll with your desired options
      const locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        // Optional: adjust options as needed:
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },
      })
      // Optionally, update locomotive scroll on route changes
      app.router.afterEach(() => {
        setTimeout(() => locoScroll.update(), 500)
      })
      // Inject it so you can access it via this.$locoScroll in your components
      inject('locoScroll', locoScroll)
    }
  }

  // Wait for the DOM to be ready before initializing
  if (process.client) {
    window.addEventListener('load', () => {
      initLocomotive()
    })
  }
}
