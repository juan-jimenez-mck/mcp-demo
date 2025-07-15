import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SendIcon } from 'lucide-react';
import { getEmailById } from '../api';
import { EmailStatusTypes } from '../constants';
import { Badge } from '@/components/ui/badge';

export type EmailPanelProps = {
  emailId: number;
};

export default function EmailPanel({ emailId }: EmailPanelProps) {
  const { data: email, isLoading } = useQuery({
    queryKey: ['email', emailId],
    queryFn: () => getEmailById(emailId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="h-full overflow-y-auto rounded-none border-0 py-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Email No. {email?.id}</span>
          <Badge variant="outline">{email?.status}</Badge>
        </CardTitle>
        <CardDescription>Subject: {email?.subject}</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full w-full flex-col gap-4 overflow-y-auto">
        <pre className="text-sm whitespace-pre-wrap">{email?.body}</pre>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-8 py-2">
        <div className="flex gap-5">
          <Button disabled={email?.status === EmailStatusTypes.SENT}>
            <SendIcon />{' '}
            {email?.status === EmailStatusTypes.SENT ? 'Sent' : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
