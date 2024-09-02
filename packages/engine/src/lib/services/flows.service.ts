import { FlowsContext } from '@activepieces/pieces-framework'
import { PopulatedFlow, SeekPage } from '@activepieces/shared'


type CreateFlowsServiceParams = {
    engineToken: string
    internalApiUrl: string
}
export const createFlowsContext = ({ engineToken, internalApiUrl }: CreateFlowsServiceParams): FlowsContext => {
    return {
        async list(): Promise<SeekPage<PopulatedFlow>> {
            const response = await fetch(`${internalApiUrl}v1/engine/populated-flows`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${engineToken}`,
                },
            })
            return response.json()
        },
    }
}
