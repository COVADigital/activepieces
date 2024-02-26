import { Type, Static } from '@sinclair/typebox'
import { ApId } from '@activepieces/shared'
import { ACTIVITY_EVENT_LENGTH, ACTIVITY_MESSAGE_LENGTH, ACTIVITY_STATUS_LENGTH } from './activity-model'

export const AddActivityRequestBody = Type.Object({
    projectId: ApId,
    event: Type.String({ maxLength: ACTIVITY_EVENT_LENGTH }),
    message: Type.String({ maxLength: ACTIVITY_MESSAGE_LENGTH }),
    status: Type.String({ maxLength: ACTIVITY_STATUS_LENGTH }),
})

export type AddActivityRequestBody = Static<typeof AddActivityRequestBody>

export const UpdateActivityRequestBody = Type.Composite([
    Type.Object({
        projectId: ApId,
    }),
    Type.Partial(
        Type.Omit(AddActivityRequestBody, ['projectId']),
        {
            minProperties: 1,
        }
    ),
])

export type UpdateActivityRequestBody = Static<typeof UpdateActivityRequestBody>
