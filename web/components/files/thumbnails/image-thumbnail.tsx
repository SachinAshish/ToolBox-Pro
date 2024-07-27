'use client';

import Image from 'next/image';
import { useState } from 'react';
import FallbackThumbnail from './fallback-thumbnail';

type Props = {
   imageUrl: string;
};

const ImageThumbnail = ({ imageUrl }: Props) => {
   const [error, setError] = useState(false);
   return !error ? (
      <Image
         src={imageUrl}
         height={500}
         width={500}
         alt={'preview'}
         className="h-full w-full object-fill"
         onError={() => setError(true)}
      />
   ) : (
      <FallbackThumbnail mime={'image'} />
   );
};

export default ImageThumbnail;
