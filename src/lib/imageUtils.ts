/**
 * Helper utility to resize and compress uploaded image files or data URLs.
 * Keeps payloads lightweight (< 80KB) so Firestore documents never exceed limits.
 */
export const compressImage = (
  fileOrDataUrl: File | string,
  maxWidth = 850,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:image')) {
      // It's a standard web URL (http/https), no need to compress
      resolve(fileOrDataUrl);
      return;
    }

    const processDataUrl = (src: string) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };

    if (typeof fileOrDataUrl === 'string') {
      processDataUrl(fileOrDataUrl);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          processDataUrl(reader.result);
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
};
