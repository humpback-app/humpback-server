/**
 * Find hash of image from deezer urls
 * @param {String} url image link
 */
export const md5Image = (url: string) => url.split('/images/')[1].split('/')[1];
