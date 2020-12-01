import { OptionItem } from './config'
import { D } from './lib/dict'
const inquirer = require('inquirer')
const Chalk = require('chalk')
export interface BranchAnswers {
    type: string
    swimlane: string
    packageName: string
    businessKey: string
    id: string
    desc: string
    [x: string]: string
}

const CONFIRM_QUESTIONS = [
    {
        type: 'input',
        name: 'confirm',
        message: D.ANSWER_CONF,
        default: 'Y'
    }
]

const getQuestions = (currentBranch: BranchAnswers, config: readonly OptionItem[]) => {
    const currentQuestions = config.slice()
    return {
        questions: currentQuestions.map(question => {
            const { name, type, message, options, default: df } = question as any
            if (options) {
                return { choices: options, name, type, message, default: df }
            }
            return { name, type, message, default: df }
        }),
        defaults: currentQuestions.reduce((prev, curr) => {
            prev[curr.name] =
                /** Top1: 从老 Branch 来 */
                currentBranch[curr.name]
                    ? currentBranch[curr.name]
                    /** Top2: 从用户定义的配置中 来 */
                    : curr.default
            return prev
        }, {} as Partial<BranchAnswers>)
    }
}

const logAnswers = (answers: Partial<BranchAnswers>) => {
    console.log(D.ANSWER_LIST)
    Object.keys(answers).forEach(answerKey => {
        if (answers[answerKey]) {
            console.log(Chalk.green(`${answerKey}: `) + Chalk.white(answers[answerKey]))
        }
    })
}


export const askQuestions = async (config: readonly OptionItem[], currentBranch: BranchAnswers) => {
    let confirmed = false
    const { questions, defaults } = getQuestions(currentBranch, config)
    let answers = Object.assign({}, defaults)
    while (!confirmed) {
        answers = Object.assign({}, defaults, await inquirer.prompt(questions))
        console.log()
        logAnswers(answers)
        const userConfirm = await inquirer.prompt(CONFIRM_QUESTIONS)
        if (userConfirm.confirm.toLowerCase() === 'y') {
            confirmed = true
        } else {
            console.log()
            console.log()
        }
    }
    if (!confirmed) throw new Error()
    return answers
}