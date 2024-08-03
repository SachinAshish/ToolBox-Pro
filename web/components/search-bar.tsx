'use client';
import { useEffect, useState, useTransition } from 'react';
import {
   CommandDialog,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Search } from 'lucide-react';
import { searchObjects, searchTrashObjects } from '@/data/files/search';
import { contentType } from '@/types';
import FileIcon from './files/file-icon';
import { getFilePath, withoutTrailingSlash } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { DialogTitle } from './ui/dialog';
import { FILES_URL, TRASH_URL } from '@/routes';

function SearchBar() {
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [inputValue, setInputValue] = useState('');
   const [isPending, startTransition] = useTransition();
   const [search, setSearch] = useState('');
   const [searchResults, setSearchResults] = useState<{
      files: contentType[];
      trash: contentType[];
   }>({
      files: [],
      trash: [],
   });

   useEffect(() => {
      const down = (e: KeyboardEvent) => {
         if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen((open) => !open);
         }
      };
      document.addEventListener('keydown', down);
      return () => document.removeEventListener('keydown', down);
   }, []);

   // For debouncing the input from the user
   useEffect(() => {
      const timeoutId = setTimeout(() => {
         setSearch(inputValue);
      }, 300);
      return () => clearTimeout(timeoutId);
   }, [inputValue]);

   useEffect(() => {
      searchFiles();
      searchTrash();
   }, [search]);

   const searchFiles = () => {
      if (!search) {
         setSearchResults((prev) => ({ ...prev, files: [] }));
         return;
      }
      startTransition(async () => {
         const searchRes = await searchObjects(search);
         if (searchRes.success) setSearchResults((prev) => ({ ...prev, files: searchRes.data }));
      });
   };

   const searchTrash = () => {
      if (!search) {
         setSearchResults((prev) => ({ ...prev, trash: [] }));
         return;
      }
      startTransition(async () => {
         const searchRes = await searchTrashObjects(search);
         if (searchRes.success) setSearchResults((prev) => ({ ...prev, trash: searchRes.data }));
      });
   };

   return (
      <>
         <Button
            className="group flex w-32 items-center gap-2 border bg-background p-2 pr-2.5 hover:bg-background/50 hover:dark:bg-background/50"
            onClick={() => setOpen(true)}
         >
            <Input
               type="text"
               placeholder="Ctrl + K"
               className="pointer-events-none h-7 border-none bg-neutral-200 p-2 shadow-inner transition group-hover:bg-neutral-300 dark:bg-slate-800 dark:group-hover:bg-slate-800"
            />
            <Search className="h-5 w-5 text-primary" />
         </Button>
         <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
            <DialogTitle className="sr-only hidden">Search</DialogTitle>
            <CommandInput
               placeholder="Type a command or search..."
               value={inputValue}
               onValueChange={setInputValue}
            />
            <CommandList>
               {searchResults.files.length !== 0 && (
                  <CommandGroup heading="Files">
                     {searchResults.files.map(
                        ({ type, name, path }: contentType, index: number) => (
                           <CommandItem
                              key={index}
                              onSelect={() => {
                                 const dashUrl = FILES_URL;
                                 const contentPath = withoutTrailingSlash(
                                    getFilePath(withoutTrailingSlash(path.replace('Files', ''))),
                                 );
                                 const contentId =
                                    (type === 'directory' ? 'dir' : 'file') + '-' + name;
                                 const folderLink = dashUrl + contentPath + '#' + contentId;
                                 router.push(folderLink);
                                 setOpen(false);
                              }}
                           >
                              <div className="flex w-full items-center justify-between">
                                 <div className="flex w-[70%] gap-2">
                                    <FileIcon mime={type || 'file'} />{' '}
                                    <span className="w-[85%] truncate text-ellipsis text-nowrap">
                                       {name}
                                    </span>
                                 </div>
                                 <span className="w-[40%] truncate text-ellipsis text-nowrap text-xs text-muted-foreground">
                                    {path}
                                 </span>
                              </div>
                           </CommandItem>
                        ),
                     )}
                  </CommandGroup>
               )}
               {searchResults.trash.length !== 0 && (
                  <CommandGroup heading="Trash">
                     {searchResults.trash.map(
                        ({ type, name, path }: contentType, index: number) => (
                           <CommandItem
                              key={index}
                              onSelect={() => {
                                 const contentPath = withoutTrailingSlash(
                                    getFilePath(withoutTrailingSlash(path.replace('Trash', ''))),
                                 );
                                 const contentId =
                                    (type === 'directory' ? 'dir' : 'file') + '-' + name;
                                 const folderLink = TRASH_URL + contentPath + '#' + contentId;
                                 router.push(folderLink);
                                 setOpen(false);
                              }}
                           >
                              <div className="flex w-full items-center justify-between">
                                 <div className="flex w-[70%] gap-2">
                                    <FileIcon mime={type || 'file'} />{' '}
                                    <span className="w-[85%] truncate text-ellipsis text-nowrap">
                                       {name}
                                    </span>
                                 </div>
                                 <span className="w-[40%] truncate text-ellipsis text-nowrap text-xs text-muted-foreground">
                                    {'Trash/' + name}
                                 </span>
                              </div>
                           </CommandItem>
                        ),
                     )}
                  </CommandGroup>
               )}
               {!Object.values(searchResults).reduce(
                  (acc, curr) => acc || curr.length !== 0,
                  false,
               ) &&
                  search !== '' &&
                  !isPending && (
                     <CommandEmpty className="grid h-32 w-full place-items-center text-muted-foreground">
                        Nothing Found
                     </CommandEmpty>
                  )}
               {search === '' && (
                  <CommandEmpty className="grid h-32 w-full place-items-center text-muted-foreground">
                     Type something to search.
                  </CommandEmpty>
               )}
               {isPending && (
                  <CommandEmpty className="grid h-32 w-full place-items-center text-muted-foreground">
                     <Loader2 className="h-6 w-6 animate-spin" />
                  </CommandEmpty>
               )}
            </CommandList>
         </CommandDialog>
      </>
   );
}

export default SearchBar;
