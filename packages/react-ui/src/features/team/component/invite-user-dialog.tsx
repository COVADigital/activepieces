import { typeboxResolver } from '@hookform/resolvers/typebox';
import { Static, Type } from '@sinclair/typebox';
import { useMutation } from '@tanstack/react-query';
import { CopyIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormField, FormItem, Form, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { PlatformRoleSelect } from '@/features/team/component/platform-role-select';
import { ProjectRoleSelect } from '@/features/team/component/project-role-select';
import { userInvitationApi } from '@/features/team/lib/user-invitation';
import { platformHooks } from '@/hooks/platform-hooks';
import { projectHooks } from '@/hooks/project-hooks';
import { HttpError } from '@/lib/api';
import { authenticationSession } from '@/lib/authentication-session';
import { formatUtils } from '@/lib/utils';
import {
  InvitationType,
  PlatformRole,
  ProjectMemberRole,
  SendUserInvitationRequest,
  UserInvitationWithLink,
} from '@activepieces/shared';

import { userInvitationsHooks } from '../lib/user-invitations-hooks';

const FormSchema = Type.Object({
  email: Type.String({
    errorMessage: 'Please enter a valid email address',
    pattern: formatUtils.EMAIL_REGEX,
  }),
  type: Type.Enum(InvitationType, {
    errorMessage: 'Please select invitation type',
    required: true,
  }),
  platformRole: Type.Enum(PlatformRole, {
    errorMessage: 'Please select platform role',
    required: true,
  }),
  projectRole: Type.Enum(ProjectMemberRole, {
    errorMessage: 'Please select project role',
    required: true,
  }),
});

type FormSchema = Static<typeof FormSchema>;

export function InviteUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');
  const { platform } = platformHooks.useCurrentPlatform();
  const { refetch } = userInvitationsHooks.useInvitations();
  const { project } = projectHooks.useCurrentProject();
  const currentUser = authenticationSession.getCurrentUser();

  const { mutate, isPending } = useMutation<
    UserInvitationWithLink,
    HttpError,
    SendUserInvitationRequest
  >({
    mutationFn: (data) => {
      const request: SendUserInvitationRequest = {
        email: data.email,
        type: data.type,
        platformRole: data.platformRole,
        projectId: data.type === InvitationType.PLATFORM ? null : project.id,
        projectRole:
          data.type === InvitationType.PLATFORM ? undefined : data.projectRole,
      };
      return userInvitationApi.invite(request);
    },
    onSuccess: (res) => {
      if (res.link) {
        setInvitationLink(res.link);
      } else {
        setIsOpen(false);
        toast({
          title: 'Invitation sent successfully',
        });
      }
      refetch();
      //TODO: navigate to platform admin users
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<FormSchema>({
    resolver: typeboxResolver(FormSchema),
    defaultValues: {
      email: '',
      type: platform.manageProjectsEnabled
        ? InvitationType.PROJECT
        : InvitationType.PLATFORM,
      platformRole: PlatformRole.ADMIN,
      projectRole: ProjectMemberRole.ADMIN,
    },
  });

  const copyInvitationLink = () => {
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: 'Invitation link copied successfully',
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="flex items-center justify-center gap-2 w-full"
        >
          <Plus className="size-4" />
          <span>Invite User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {invitationLink ? 'Invitation Link' : 'Invite User'}
          </DialogTitle>
          <DialogDescription>
            {invitationLink
              ? `Please copy the link below and share it with the user you want
                to invite, the invitation expires in 24 hours.`
              : `Type the email address of the user you want to invite, the
                invitation expires in 24 hours.
           `}
          </DialogDescription>
        </DialogHeader>

        {!invitationLink ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutate(data))}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input {...field} type="text" placeholder="jon@doe.com" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <Label>Invite To</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Invite To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Invite To</SelectLabel>
                          {currentUser?.platformRole === PlatformRole.ADMIN && (
                            <SelectItem value={InvitationType.PLATFORM}>
                              Entire Platform
                            </SelectItem>
                          )}
                          {platform.projectRolesEnabled && (
                            <SelectItem value={InvitationType.PROJECT}>
                              {project.displayName} (Current)
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              {form.getValues().type === InvitationType.PLATFORM && (
                <PlatformRoleSelect form={form} />
              )}
              {form.getValues().type === InvitationType.PROJECT && (
                <ProjectRoleSelect form={form} />
              )}

              {form?.formState?.errors?.root?.serverError && (
                <FormMessage>
                  {form.formState.errors.root.serverError.message}
                </FormMessage>
              )}
              <DialogFooter>
                <Button type="submit" loading={isPending}>
                  Invite
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <Label htmlFor="invitationLink" className="mb-2">
              Invitation Link
            </Label>
            <div className="flex">
              <Input
                name="invitationLink"
                type="text"
                readOnly={true}
                defaultValue={invitationLink}
                placeholder="Invitation Link"
                onFocus={(event) => {
                  event.target.select();
                  copyInvitationLink();
                }}
                className=" rounded-l-md rounded-r-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={'outline'}
                    className=" rounded-l-none rounded-r-md"
                    onClick={copyInvitationLink}
                  >
                    <CopyIcon height={15} width={15}></CopyIcon>
                  </Button>
                </TooltipTrigger>

                <TooltipContent side="bottom">Copy</TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
