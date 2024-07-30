export function getFileSize(bytes: number) {
   const sizes = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];
   if (bytes === 0) return '0b';
   const i = Math.floor(Math.log(bytes) / Math.log(1024));
   return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + sizes[i];
}
