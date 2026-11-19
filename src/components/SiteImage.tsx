import React from 'react';
import { imageUrl } from '../utils/images';

export function SiteImage({ src, loading = 'lazy', decoding = 'async', ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const width = loading === 'eager' ? 1600 : 800;
  return <img {...props} src={imageUrl(src, width)} loading={loading} decoding={decoding} />;
}
