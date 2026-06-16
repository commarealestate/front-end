/** Backend talent image limit: 2048 KB */
export const MAX_TALENT_IMAGE_BYTES = 2048 * 1024

/** Backend emiratisation moment media limit: 51200 KB (50 MB) */
export const MAX_MOMENT_MEDIA_BYTES = 51200 * 1024

export function normalizeExternalUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed.replace(/^\/+/, '')}`
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))} MB`
  }

  return `${Math.round(bytes / 1024)} KB`
}

export function validateFileMaxSize(
  file: File,
  maxBytes: number,
  label = 'File',
): string | null {
  if (file.size <= maxBytes) {
    return null
  }

  return `${label} is too large (${formatBytes(file.size)}). Maximum allowed size is ${formatBytes(maxBytes)}.`
}
