import { IoMdImage } from 'react-icons/io';
import { RiClapperboardFill } from 'react-icons/ri';
import { FaFile } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

type Props = {
   mime: string;
   className?: string;
};

const FileIcon = ({ mime, className = '' }: Props) => {
   const iconMap: { [key: string]: React.ReactElement } = {
      image: <IoMdImage className={cn(className, 'text-red-400')} />,
      video: <RiClapperboardFill className={cn(className, 'text-purple-400')} />,
      file: <FaFile className={cn(className, 'text-blue-400')} />,
   };

   for (const str in iconMap) if (mime.includes(str)) return iconMap[str];

   return iconMap['file'];
};

export default FileIcon;
