module.exports = {
    config: [
        {
            name: 'type',
            type: 'list',
            optional: false,
            default: 'feature',
            envDefault: '',
            message: 'Select branch type: ',
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
            message: 'Input using swimlane: ',
            prefix: 'sl-',
            regExp: 'sl-([0-9a-z]{4,}-[a-z]{5})'
        },
        {
            name: 'packageName',
            type: 'input',
            optional: true,
            envDefault: '',
            default: '',
            message: 'Input subPackage folder name：',
            prefix: '@',
            regExp: '@([0-9a-z-]+)'
        },
        {
            name: 'businessKey',
            type: 'input',
            optional: true,
            envDefault: '',
            default: '',
            message: 'Input businessKey: ',
            prefix: '#',
            regExp: '#([0-9a-zA-Z_]+)'
        },
        {
            name: 'id',
            type: 'input',
            optional: true,
            envDefault: '',
            default: '',
            message: 'Input relative wiki or issue id: ',
            prefix: '',
            regExp: '(km-[0-9]+|ones-[0-9]+|tt-[0-9]+)'
        }
    ],
    skip: [
        'master',
        'staging',
        'test'
    ]
}