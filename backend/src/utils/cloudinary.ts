import { v2 as cloudinary } from 'cloudinary';

const cloudName  = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey     = process.env.CLOUDINARY_API_KEY;
const apiSecret  = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.warn('⚠️  Cloudinary is not fully configured in env variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).');
}

/**
 * Upload a Buffer to Cloudinary.
 * @returns { url, publicId } — Cloudinary secure URL and public_id
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; filename?: string; mimetype?: string } = {},
): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, any> = {
      folder: options.folder ?? 'goc-gallery',
      resource_type: 'image',
      overwrite: false,
    };

    if (options.filename) {
      uploadOptions.public_id = options.filename;
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error('Cloudinary upload returned no result'));
      } else {
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    });

    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured) return;
  await cloudinary.uploader.destroy(publicId);
}
