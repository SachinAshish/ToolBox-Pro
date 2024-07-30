import { IoMdImage } from 'react-icons/io';
import { RiClapperboardFill } from 'react-icons/ri';
import { FaFile, FaFolder } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

type Props = {
   mime: string | false;
   className?: string;
};

const FileIcon = ({ mime, className = '' }: Props) => {
   const iconMap: { [key: string]: React.ReactElement } = {
      image: <IoMdImage className={cn(className, 'text-red-400')} />,
      video: <RiClapperboardFill className={cn(className, 'text-purple-400')} />,
      directory: <FaFolder className="h-5 w-5 text-gray-500 dark:text-gray-400" />,
      file: <FaFile className={cn(className, 'text-blue-400')} />,
   };

   for (const str in iconMap) if (mime && mime.includes(str)) return iconMap[str];

   return iconMap['file'];
};

export default FileIcon;
