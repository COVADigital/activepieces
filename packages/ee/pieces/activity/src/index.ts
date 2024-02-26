import { createPiece, PieceAuth } from '@activepieces/pieces-framework'
import { createActivity } from './lib/actions/create-activity'
import { updateActivity } from './lib/actions/update-activity'

export const activity = createPiece({
    displayName: 'Activity',
    auth: PieceAuth.None(),
    minimumSupportedRelease: '0.20.0',
    logoUrl: 'https://cdn.activepieces.com/pieces/activity.svg',
    authors: [
        'khaledmashaly',
    ],
    actions: [
        createActivity,
        updateActivity,
    ],
    triggers: [],
})
