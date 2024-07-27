import React, { ReactElement } from 'react';
import ImageThumbnail from './thumbnails/image-thumbnail';
import FallbackThumbnail from './thumbnails/fallback-thumbnail';

type Props = {
   fileUrl: string;
   fileType: string;
};

const FileThumbnail = ({ fileUrl, fileType }: Props) => {
   if (!fileUrl) return null;
   const thumbnails: { [key: string]: ReactElement } = {
      image: <ImageThumbnail imageUrl={fileUrl} />,
      default: <FallbackThumbnail mime={fileType} />,
   };

   for (const type in thumbnails) if (fileType.includes(type)) return thumbnails[type];
   return thumbnails['default'];
};

export default FileThumbnail;
