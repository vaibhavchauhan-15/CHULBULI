interface CloudinaryTransformOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'thumb'
  quality?: string
}

/**
 * Lightweight URL transformation helper that works in both client and server code.
 */
export function getCloudinaryThumbnailUrl(
  url: string | null | undefined,
  options: CloudinaryTransformOptions = {}
) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url || ''
  }

  const width = options.width ?? 320
  const height = options.height ?? 320
  const crop = options.crop ?? 'fill'
  const quality = options.quality ?? 'auto:good'
  const transform = `f_auto,q_${quality},dpr_auto,c_${crop},w_${width},h_${height}`

  return url.replace('/upload/', `/upload/${transform}/`)
}
