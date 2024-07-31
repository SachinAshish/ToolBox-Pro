import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useHash = () => {
   const params = useParams();
   const [hash, setHash] = useState('');
   useEffect(() => {
      setHash(window.location.hash);
   }, [params]);
   return hash;
};
