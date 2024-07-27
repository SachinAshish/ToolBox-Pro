import React from 'react';
import FileIcon from '../file-icon';

type Props = {
   mime: string;
};

const FallbackThumbnail = ({ mime }: Props) => {
   return (
      <div className="grid h-full w-full place-items-center">
         <FileIcon mime={mime} className="h-10 w-10" />
      </div>
   );
};

export default FallbackThumbnail;
