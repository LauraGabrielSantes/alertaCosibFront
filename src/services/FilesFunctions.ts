export class FilesFunctions {
  /**
   * Comprime un Blob de imagen si excede el tamaño máximo especificado.
   * @param originalBlob - El Blob de imagen original.
   * @param maxSizeInBytes - El tamaño máximo permitido en bytes. //3mb
   * @returns Una promesa que se resuelve con el Blob de imagen comprimido.
   */
  public static async comprimirImagen(
    originalBlob: Blob,
    maxSizeInBytes: number = 3 * 1000 * 1000,
  ): Promise<Blob> {
    return this.compressImage(originalBlob, maxSizeInBytes);
  }

  /**
   * Comprime un Blob de imagen para asegurarse de que no exceda el tamaño máximo especificado.
   * Redimensiona la imagen a al menos 320x400 y conserva la parte central.
   * @param originalBlob - El Blob de imagen original.
   * @param maxSizeInBytes - El tamaño máximo permitido en bytes.
   * @returns Una promesa que se resuelve con el Blob de imagen comprimido.
   * @throws si no se puede crear la imagen del archivo de imagen
   */
  private static async compressImage(
    originalBlob: Blob,
    maxSizeInBytes: number,
  ): Promise<Blob> {
    const lienzo = document.createElement('canvas');
    const ctx = lienzo.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto 2D');
    }
    const img = await this.crearImagenDesdeBlob(originalBlob);

    const targetWidth = 320;
    const targetHeight = 400;

    // Calculate the scaling factor to maintain aspect ratio
    const scale = Math.max(targetWidth / img.width, targetHeight / img.height);

    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    lienzo.width = targetWidth;
    lienzo.height = targetHeight;

    const sx = (scaledWidth - targetWidth) / 2;
    const sy = (scaledHeight - targetHeight) / 2;

    let calidad = 0.9;
    let blobResultado: Blob | null = null;

    const url = URL.createObjectURL(blobResultado ?? originalBlob);
    const a = document.createElement('a');

    do {
      ctx.clearRect(0, 0, lienzo.width, lienzo.height); // Limpia el canvas
      ctx.drawImage(img, -sx, -sy, scaledWidth, scaledHeight);

      blobResultado = await new Promise<Blob | null>((resolve) => {
        lienzo.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          calidad,
        );
      });

      calidad -= 0.1;
    } while (
      blobResultado &&
      blobResultado.size > maxSizeInBytes &&
      calidad > 0.1
    );

    return blobResultado ?? originalBlob;
  }

  /**
   * Crea un HTMLImageElement a partir de un Blob.
   * @param blob - El Blob de imagen.
   * @returns Una promesa que se resuelve con un HTMLImageElement.
   */
  private static async crearImagenDesdeBlob(
    blob: Blob,
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => resolve(img);
      img.onerror = (_) =>
        reject(new Error('No se pudo crear la imagen a partir del Blob'));
    });
  }
}
