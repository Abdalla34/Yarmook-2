export function useHyperpay() {
  const isLoaded = ref(false)
  const error = ref<string | null>(null)

  function cleanup() {
    document.querySelectorAll('script[src*="paymentWidgets.js"]').forEach(el => el.remove())
    delete (window as any).wpwlOptions
    isLoaded.value = false
    error.value = null
  }

  function loadWidget(checkoutId: string, resultUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cleanup()

      ;(window as any).wpwlOptions = {
        onCheckoutSuccess(parameters: any) {
          const suffix = parameters?.id ? `&id=${encodeURIComponent(parameters.id)}` : ''
          window.location.href = `${resultUrl}${suffix}`
        },
        onCheckoutFailure() {
          window.location.href = resultUrl.replace('/status?', '/failure?')
        },
        onCheckoutCancel() {
          window.location.href = resultUrl.replace('/status?', '/cancel?')
        },
      }

      const script = document.createElement('script')
      script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`
      script.async = true

      script.onload = () => {
        isLoaded.value = true
        resolve()
      }

      script.onerror = () => {
        const msg = 'Failed to load payment widget'
        error.value = msg
        reject(new Error(msg))
      }

      document.head.appendChild(script)
    })
  }

  if (import.meta.client) {
    onUnmounted(() => cleanup())
  }

  return { loadWidget, cleanup, isLoaded, error }
}
