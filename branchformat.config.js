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
        }
    ],
    skip: [
        'master',
        'staging',
        'test'
    ]
}