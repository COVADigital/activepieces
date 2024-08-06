import { ApId, BaseModelSchema } from '@activepieces/shared';
import { Static, Type } from '@sinclair/typebox';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';

import { alertsApi } from '../lib/alerts-api';

import { AddAlertEmailDialog } from './add-alert-email-dialog';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/spinner';
import { INTERNAL_ERROR_TOAST, useToast } from '@/components/ui/use-toast';
import { authenticationSession } from '@/lib/authentication-session';

// re-implement the type from EE-Shared
export enum AlertChannel {
  EMAIL = 'EMAIL',
}

export const Alert = Type.Object({
  ...BaseModelSchema,
  projectId: ApId,
  channel: Type.Enum(AlertChannel),
  receiver: Type.String({}),
});

export type Alert = Static<typeof Alert>;

const fetchData = async () => {
  const page = await alertsApi.list({
    projectId: authenticationSession.getProjectId(),
    limit: 100,
  });
  return page.data;
};

export default function AlertsEmailsCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, isError, isSuccess, refetch } = useQuery<
    Alert[],
    Error,
    Alert[]
  >({
    queryKey: ['alerts-email-list'],
    queryFn: fetchData,
  });

  const deleteMutation = useMutation<void, Error, Alert>({
    mutationFn: (alert) => alertsApi.delete(alert.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['alerts-email-list'],
        exact: true,
      });
      toast({
        title: 'Success',
        description: 'Your changes have been saved.',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast(INTERNAL_ERROR_TOAST);
      console.log(error);
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Emails</CardTitle>
        <CardDescription>
          Add email addresses to receive alerts.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="min-h-[35px]">
          {isLoading && (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {isError && <div>Error, please try again.</div>}
          {isSuccess && data.length === 0 && (
            <div className="text-center">No emails added yet.</div>
          )}
          {Array.isArray(data) &&
            data.map((alert: Alert) => (
              <div
                className="flex items-center justify-between space-x-4"
                key={alert.id}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {alert.receiver}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="size-8 p-0"
                  onClick={() => deleteMutation.mutate(alert)}
                >
                  <Trash className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
        </div>
        <AddAlertEmailDialog onAdd={() => refetch()} />
      </CardContent>
    </Card>
  );
}
