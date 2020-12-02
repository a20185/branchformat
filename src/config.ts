import { D } from './lib/dict'

export interface BaseOption {
    name: string
    optional: boolean
    envDefault: string
    default: string
    message: string
    prefix: string
    regExp: string
}
export interface InputOption extends BaseOption {
    type: 'input'
}
export interface ListOption extends BaseOption {
    type: 'list'
    options: readonly string[]
}

export type OptionItem = ListOption | InputOption

const unifyConfigs = (item: OptionItem[]): OptionItem[] => {
    return item.map(config => {
        const listDefaults =
            config.type === 'list'
                ? { type: 'list', options: config.options?.length ? config.options : [] }
                : {}
        const inputDefaults =
            config.type === 'input'
                ? { type: 'input' }
                : {}
        return {
            name: config.name,
            message: config?.message ?? D.CONFIG_DEFH.replace('__ITM_NAME__', config.name),
            default: config?.default ?? '',
            envDefault: config?.envDefault ?? '',
            optional: config?.optional ?? true,
            prefix: config?.prefix ?? '',
            regExp: config?.regExp ?? '(.*)',
            ...inputDefaults,
            ...listDefaults
        } as any
    })
}

const BRANCH_CONFIG = [
    {
        name: 'type',
        type: 'list',
        optional: false,
        default: 'feature',
        envDefault: '',
        message: D.CONFIG_TYPE,
        prefix: '',
        options: ['feature', 'bugfix', 'hotfix'],
        regExp: '(feature|bugfix|hotfix)'
    },
    {
        name: 'swimlane',
        type: 'input',
        optional: true,
        default: '',
        envDefault: '',
        message: D.CONFIG_SWIM,
        prefix: 'sl-',
        regExp: 'sl-([0-9a-z]{4,}-[a-z]{5})'
    },
    {
        name: 'packageName',
        type: 'input',
        optional: true,
        envDefault: '',
        default: '',
        message: D.CONFIG_SUBP,
        prefix: '@',
        regExp: '@([0-9a-z-]+)'
    },
    {
        name: 'businessKey',
        type: 'input',
        optional: true,
        envDefault: '',
        default: '',
        message: D.CONFIG_BIZK,
        prefix: '#',
        regExp: '#([0-9a-zA-Z_]+)'
    },
    {
        name: 'id',
        type: 'input',
        optional: true,
        envDefault: '',
        default: '',
        message: D.CONFIG_REID,
        prefix: '',
        regExp: '(km-[0-9]+|ones-[0-9]+|tt-[0-9]+)'
    }
] as const

export const getCurrentConfig = (userConfig: OptionItem[]): readonly OptionItem[] => {
    /** user definedConfig */
    const customConfig = unifyConfigs(userConfig)
    if (customConfig.length) {
        return customConfig.filter(config => config.name !== 'desc').concat([
            {
                name: 'desc',
                type: 'input',
                optional: false,
                message: D.CONFIG_DESC,
                envDefault: '',
                default: '',
                prefix: '',
                regExp: '.*$'
            }
        ])
    }
    /** TODO: Merge user configs, use .branchformatrc */
    return (BRANCH_CONFIG.slice() as OptionItem[]).concat([
        {
            name: 'desc',
            type: 'input',
            optional: false,
            message: D.CONFIG_DESC,
            envDefault: '',
            default: '',
            prefix: '',
            regExp: '.*$'
        }
    ])

}