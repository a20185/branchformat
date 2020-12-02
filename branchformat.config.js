module.exports = {
    config: [
        {
            name: 'type',
            type: 'list',
            optional: false,
            default: 'feature',
            message: '我是一个测试用branchFormatConfig 哈哈哈',
            prefix: '',
            options: ['feature', 'bugfix', 'hotfix', 'docs'],
            regExp: '(feature|bugfix|hotfix|docs)'
        },
        {
            name: 'conf',
            type: 'input',
            optional: true,
            default: '',
            envDefault: process.cwd().split('/').pop(),
            prefix: '@',
            regExp: '@([a-zA-Z0-9]+)'
        }
    ],
    skip: [
        'master',
        'staging',
        'test'
    ]
}