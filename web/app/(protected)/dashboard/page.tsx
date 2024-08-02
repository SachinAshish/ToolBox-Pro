import DashboardAiCard from '@/components/dashboard/ai/dash-card';
import DashboardAutomationCard from '@/components/dashboard/automation/dash-card';
import DashboardFormsCard from '@/components/dashboard/forms/dash-card';
import DashboardNotesCard from '@/components/dashboard/notes/dash-card';
import NotificationCard from '@/components/dashboard/notification-card';
import DashboardToolsCard from '@/components/dashboard/tools/dash-card';
import DashboardWebpageCard from '@/components/dashboard/webpage/dash-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth/auth';
import { SETTINGS_URL } from '@/routes';
import Link from 'next/link';

type Props = {};

const DashboardPage = async (props: Props) => {
   const session = await currentUser();
   const notifications = [
      {
         service: <span className="text-red-500">Automation</span>,
         time: '12:30AM',
         title: 'Email sent',
         description: 'A email was sent to someone from your automation.',
      },
      {
         service: <span className="text-green-500">PDF-tools</span>,
         time: '10:30AM',
         title: 'File saved',
         description: (
            <span>
               A file was saved at{' '}
               <Badge>
                  <Link href="/dashboard/files">Files/</Link>
               </Badge>{' '}
               after completion of the process.
            </span>
         ),
      },
      {
         service: <span className="text-blue-500">Todo</span>,
         time: '9:00AM',
         title: 'Meeting Reminder',
         description: (
            <span>
               You have an online meeting at <Badge>1:00PM</Badge> with the toolbox website client.
            </span>
         ),
      },
   ];
   return (
      <main>
         <h1 className="text-4xl font-bold">Dashboard</h1>
         <div className="my-4 w-full rounded-lg bg-secondary p-3 px-4 text-sm text-muted-foreground">
            You can customize the layout of your dashboard in the{' '}
            <Link href={SETTINGS_URL} className="font-semibold">
               settings
            </Link>
         </div>
         <div className="flex w-full gap-4">
            <div className="flex w-[70%] flex-col gap-4">
               <DashboardNotesCard />
               <DashboardAutomationCard />
               <DashboardFormsCard />
               <DashboardWebpageCard />
            </div>
            <div className="flex h-full min-h-56 w-[30%] min-w-72 flex-col gap-4">
               <Card>
                  <CardHeader className="p-3 lg:p-4">
                     <CardTitle className="text-lg">Notifications</CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="flex flex-col gap-3 p-3 lg:p-4">
                     {notifications.map((notification, index) => (
                        <NotificationCard {...notification} key={index} />
                     ))}
                  </CardContent>
               </Card>
               <DashboardToolsCard className="w-full" />
               <DashboardAiCard className="w-full" />
            </div>
         </div>
      </main>
   );
};

export default DashboardPage;
