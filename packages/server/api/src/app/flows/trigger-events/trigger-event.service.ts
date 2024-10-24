import {
    ActivepiecesError,
    apId,
    Cursor,
    ErrorCode,
    FlowId,
    getPieceMajorAndMinorVersion,
    PieceTrigger,
    PopulatedFlow,
    ProjectId,
    sanitizeObjectForPostgresql,
    SeekPage,
    Trigger,
    TriggerEvent,
    TriggerHookType,
    TriggerType,
} from '@activepieces/shared'
import { engineRunner, webhookUtils } from 'server-worker'
import { accessTokenManager } from '../../authentication/lib/access-token-manager'
import { repoFactory } from '../../core/db/repo-factory'
import { buildPaginator } from '../../helper/pagination/build-paginator'
import { paginationHelper } from '../../helper/pagination/pagination-utils'
import { Order } from '../../helper/pagination/paginator'
import { flowService } from '../flow/flow.service'
import { TriggerEventEntity } from './trigger-event.entity'

const triggerEventRepo = repoFactory(TriggerEventEntity)

export const triggerEventService = {
    async saveEvent({
        projectId,
        flowId,
        payload,
    }: SaveEventParams): Promise<TriggerEvent> {
        const flow = await flowService.getOnePopulatedOrThrow({
            id: flowId,
            projectId,
        })

        const sourceName = getSourceName(flow.version.trigger)
        
        return triggerEventRepo().save({
            id: apId(),
            projectId,
            flowId: flow.id,
            sourceName,
            payload: sanitizeObjectForPostgresql(payload),
        })
    },

    async test({
        projectId,
        flow,
    }: TestParams): Promise<SeekPage<unknown>> {
        const trigger = flow.version.trigger
        const emptyPage = paginationHelper.createPage<TriggerEvent>([], null)
        switch (trigger.type) {
            case TriggerType.PIECE: {
                const engineToken = await accessTokenManager.generateEngineToken({
                    projectId,
                })
                const { result: testResult } = await engineRunner.executeTrigger(engineToken, {
                    hookType: TriggerHookType.TEST,
                    flowVersion: flow.version,
                    webhookUrl: await webhookUtils.getWebhookUrl({
                        flowId: flow.id,
                        simulate: true,
                    }),
                    test: true, 
                    projectId,
                })
                await triggerEventRepo().delete({
                    projectId,
                    flowId: flow.id,
                })
                if (!testResult.success) {
                    throw new ActivepiecesError({
                        code: ErrorCode.TEST_TRIGGER_FAILED,
                        params: {
                            message: testResult.message!,
                        },
                    })
                }

                for (const output of testResult.output) {
                    await triggerEventService.saveEvent({
                        projectId,
                        flowId: flow.id,
                        payload: output,
                    })
                }

                return triggerEventService.list({
                    projectId,
                    flow,
                    cursor: null,
                    limit: testResult.output.length,
                })
            }
            case TriggerType.EMPTY:
                return emptyPage
        }
    },

    async list({
        projectId,
        flow,
        cursor,
        limit,
    }: ListParams): Promise<SeekPage<TriggerEvent>> {
        const decodedCursor = paginationHelper.decodeCursor(cursor)
        const sourceName = getSourceName(flow.version.trigger)
        const flowId = flow.id
        const paginator = buildPaginator({
            entity: TriggerEventEntity,
            query: {
                limit,
                order: Order.DESC,
                afterCursor: decodedCursor.nextCursor,
                beforeCursor: decodedCursor.previousCursor,
            },
        })
        const query = triggerEventRepo().createQueryBuilder('trigger_event').where({
            projectId,
            flowId,
            sourceName,
        })
        const { data, cursor: newCursor } = await paginator.paginate(query)
        return paginationHelper.createPage<TriggerEvent>(data, newCursor)
    },
}

function getSourceName(trigger: Trigger): string {
    switch (trigger.type) {
        case TriggerType.PIECE: {
            const pieceTrigger = trigger as PieceTrigger
            const pieceName = pieceTrigger.settings.pieceName
            const pieceVersion = getPieceMajorAndMinorVersion(
                pieceTrigger.settings.pieceVersion,
            )
            const triggerName = pieceTrigger.settings.triggerName
            return `${pieceName}@${pieceVersion}:${triggerName}`
        }

        case TriggerType.EMPTY:
            return trigger.type
    }
}

type TestParams = {
    projectId: ProjectId
    flow: PopulatedFlow
}
type SaveEventParams = {
    projectId: ProjectId
    flowId: FlowId
    payload: unknown
}
type ListParams = {
    projectId: ProjectId
    flow: PopulatedFlow
    cursor: Cursor | null
    limit: number
}
