const inquirer = require('inquirer')
const Chalk = require('chalk')
interface BranchOptions {
    type: string[]
    swimlane: boolean
    packageName: boolean
    businessKey: boolean
    id: boolean
    desc: boolean
}

interface BranchAnswers {
    type: string
    swimlane: string
    packageName: string
    businessKey: string
    id: string
    desc: string
}

const DEFAULT_CONFIG_QUESTIONS = [
	{
		type: 'list',
		name: 'type',
        message: '请选择分支类型（默认：feature）:',
        options: ['feature', 'bugfix', 'hotfix'],
		default: 'feature'
	},
	{
		type: 'input',
		name: 'desc',
		message: '请输入需求/修复的描述（建议不超30个字符）：',
		default: ''
    },
    {
        type: 'input',
        name: 'swimlane',
        message: '请输入使用的泳道名称（例如 1787-qkgku、ouyifeng-hhhhh 等）：',
        default: ''
    },
    {
        type: 'input',
        name: 'packageName',
        message: '请输入子目录名称（例如 product-gx 等, 默认为当前目录名）：',
        default: ''
    },
    {
        type: 'input',
        name: 'businessKey',
        message: '请输入businessKey名称（例如 AgentOrder 等，默认无）：',
        default: ''
    },
    {
        type: 'input',
        name: 'id',
        message: '请输入关联ID（例如 ones-xxx, km-xxx, tt-xxx，默认无）：',
        default: ''
    }
]


const getQuestions = (config?: Partial<BranchOptions>) => {
    /** branch questionConfigs */
    const finalOptions: BranchOptions = {
        type: config?.type?.length ? config.type : ['feature', 'bugfix', 'hotfix'],
        swimlane: config?.swimlane ?? true,
        packageName: config?.packageName ?? false,
        businessKey: config?.businessKey ?? false,
        id: config?.id ?? false,
        desc: true
    }
    DEFAULT_CONFIG_QUESTIONS[0].options = finalOptions.type
    return {
        questions: DEFAULT_CONFIG_QUESTIONS.filter(question => {
            return Boolean(finalOptions[question.name as keyof BranchOptions])
        }),
        defaults: DEFAULT_CONFIG_QUESTIONS.filter(question => {
            return Boolean(finalOptions[question.name as keyof BranchOptions])
        }).reduce((prev, curr) => {
            prev[curr.name as keyof BranchOptions] = curr.default
            return prev
        }, {} as Partial<BranchAnswers>)
    }
}

const logAnswers = (answers: Partial<BranchAnswers>) => {
    console.log('您当前填写的信息如下：')
    if (answers.type) {
        console.log(Chalk.green('分支类型: ') + Chalk.white(answers.type))
    }
    if (answers.desc) {
        console.log(Chalk.green('分支描述: ') + Chalk.white(answers.desc))
    }
    if (answers.swimlane) {
        console.log(Chalk.green('分支类型: ') + Chalk.white(answers.swimlane))
    }
    if (answers.packageName) {
        console.log(Chalk.green('分支类型: ') + Chalk.white(answers.packageName))
    }
    if (answers.businessKey) {
        console.log(Chalk.green('分支类型: ') + Chalk.white(answers.businessKey))
    }
    if (answers.id) {
        console.log(Chalk.green('分支类型: ') + Chalk.white(answers.id))
    }
}


const askQuestions = async (config?: Partial<BranchOptions>) => {
    let confirmed = false
    const { questions, defaults } = getQuestions()
    while (!confirmed) {
        const answers = await inquirer.prompt(questions, defaults)

    }
}