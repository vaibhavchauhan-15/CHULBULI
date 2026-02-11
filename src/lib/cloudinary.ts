import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadImageOptions {
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: string;
  mimeType?: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - File path, URL, or Buffer to upload
 * @param optionsOrFolder - Optional folder or upload options
 * @returns Upload result with URL and public_id
 */
export async function uploadImage(
  file: string | Buffer,
  optionsOrFolder: string | UploadImageOptions = 'chulbuli-jewels'
) {
  try {
    const options: UploadImageOptions =
      typeof optionsOrFolder === 'string'
        ? { folder: optionsOrFolder }
        : optionsOrFolder;

    const folder = options.folder || 'chulbuli-jewels';
    const maxWidth = options.maxWidth ?? 1800;
    const maxHeight = options.maxHeight ?? 1800;
    const quality = options.quality ?? 'auto:good';
    const mimeType = options.mimeType || 'image/jpeg';

    // Convert Buffer to base64 data URI if needed
    const fileToUpload = Buffer.isBuffer(file)
      ? `data:${mimeType};base64,${file.toString('base64')}`
      : file;

    const uploadResult = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      resource_type: 'image',
      format: 'webp',
      transformation: [
        { width: maxWidth, height: maxHeight, crop: 'limit' },
        { quality, fetch_format: 'auto', dpr: 'auto' },
      ],
    });

    return {
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Get optimized image URL
 * @param publicId - The public ID of the image
 * @param width - Optional width
 * @param height - Optional height
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
) {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto:good',
    dpr: 'auto',
    flags: 'progressive',
    width,
    height,
    crop: width && height ? 'fill' : undefined,
  });
}

export default cloudinary;
