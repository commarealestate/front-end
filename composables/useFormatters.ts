export const useFormatters = () => {
  const formatPrice = (price: number | string | null | undefined) => {
    if (!price) return 'AED 0'

    const num = Number(String(price).replace(/,/g, ''))

    if (isNaN(num)) return 'AED 0'

    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(num)
  }

  return { formatPrice }
}