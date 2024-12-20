import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'

const { Modal, Offcanvas } = bootstrap

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      ModalInstance: (element, options) => new Modal(element, options),
      OffcanvasInstance: (element, options) => new Offcanvas(element, options),
    },
  }
})
