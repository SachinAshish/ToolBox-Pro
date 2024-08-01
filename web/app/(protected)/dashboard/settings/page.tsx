import React from 'react';

type Props = {};

const SettingsPage = (props: Props) => {
   return (
      <main>
         <h1 className="text-4xl font-bold">Settings</h1>
         <div className="my-4 w-full rounded-lg bg-secondary p-3 px-4 text-sm text-muted-foreground">
            Customize your experience by adjusting settings to suit your preferences.
         </div>
      </main>
   );
};

export default SettingsPage;
