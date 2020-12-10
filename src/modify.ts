import { isBranchShouldParse } from './branch'
import { OptionItem } from './config'
import { D } from './lib/dict'
import { BranchAnswers } from "./question"
const inquirer = require('inquirer')
const Chalk = require('chalk')
const Shell = require('shelljs')

const BRANCH_REMOVE_QUESTIONS = [
    {
        type: 'input',
        name: 'confirm',
        message: D.ANSWER_RMBR,
        default: 'n'
    }
]

export const modifyBranch = async (branchConfig: Partial<BranchAnswers>, config: readonly OptionItem[], sourceBranch: string, skipBranch: string[]) => {
    if (!branchConfig.type || !branchConfig.desc) {
        console.log(Chalk.red(D.HINT_NODESC))
        throw new Error(D.HINT_NODESC)
    }
    /** check if optional config has all satisfied */
    let satisfied = true
    config.forEach(option => {
        if (!branchConfig[option.name] && !option.optional) {
            satisfied = false
            console.log(Chalk.red(`${D.HINT_MUSTOP.replace('__MUST_OP__', option.name)}`))
        }
    })
    if (!satisfied) {
        console.log(Chalk.red(D.HINT_MUSTDS))
        throw new Error(D.HINT_MUSTDS)
    }
    /** Start build Branch and perform checkout */
    const targetBranch = config
        .map(option => `${branchConfig[option.name] ? option.prefix + branchConfig[option.name] : ''}` ?? '')
        .filter(Boolean)
        .join('/')
    if (sourceBranch === targetBranch) {
        console.log(Chalk.red(D.HINT_SAMEBR))
        throw new Error(D.HINT_SAMEBR)
    }
    /** performCheckout */
    console.log()
    console.log()
    console.log(Chalk.green(D.HINT_PRECKO.replace('__TGT_BR__', targetBranch)))
    console.log(Chalk.white(D.HINT_STSING))
    /** Stash changes */
    Shell.exec('git stash')
    console.log(Chalk.white(D.HINT_CHKING))
    Shell.exec(`git checkout -b ${targetBranch} -f`)
    console.log(Chalk.green(D.HINT_CHKEND))
    Shell.exec(`git push --set-upstream origin ${targetBranch} --no-verify`)
    console.log(Chalk.green(D.HINT_UPSEND))
    if (isBranchShouldParse(sourceBranch)) {
        /** Not skipped branch */
        const checkResult = await inquirer.prompt(BRANCH_REMOVE_QUESTIONS)
        if (checkResult.confirm.toUpperCase() === 'Y') {
            Shell.exec(`git branch -D ${sourceBranch}`)
            Shell.exec(`git push origin :${sourceBranch}`)

        }
    }
    console.log(Chalk.green(D.HINT_ALLEND))
}