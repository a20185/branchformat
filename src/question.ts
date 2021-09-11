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
            const { name, type, message, options, envDefault, default: df, when } = question as any
            const validate = (input: string) => {
                const inputEmpty = !input || input === 'no'
                const validateResult = Boolean(
                    (question.optional && inputEmpty) ||
                    (!inputEmpty && new RegExp(question.regExp).test(question.prefix + input))
                )
                return Promise.resolve(
                    validateResult
                        ? validateResult
                        : Chalk.red(D.ANSWER_FAIL.replace('__OPTION__', question.name)
                            .replace('__REQ_REG__', question.regExp)
                            .replace('__VALUE__', question.prefix + input))
                )
            }
            const defaults =
                /** Top1: 从 env 处理得出的默认值来 */
                envDefault
                    ? envDefault
                    /** Top2: 从老 Branch 来 */
                    : currentBranch[name]
                        ? currentBranch[name]
                        /** Top3: 从用户定义的默认值中来 */
                        : df
            if (options) {
                return { choices: options, name, type, message, envDefault, default: defaults, validate, when }
            }
            return { name, type, message, default: defaults, validate, when }
        }),
        defaults: currentQuestions.reduce((prev, curr) => {
            prev[curr.name] =
                /** Top1: 从 env 处理得出的默认值来 */
                curr.envDefault
                    ? curr.envDefault
                    /** Top2: 从老 Branch 来 */
                    : currentBranch[curr.name]
                        ? currentBranch[curr.name]
                        /** Top3: 从用户定义的默认值中来 */
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
        console.log(Chalk.cyan(D.CONFIG_TTLE))
        answers = Object.assign({}, defaults, await inquirer.prompt(questions))
        /** hold defaults */
        Object.keys(answers).forEach((answerKey) => {
            if (answers[answerKey] === 'no') {
                answers[answerKey] = ''
            }
        })
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