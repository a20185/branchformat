const chalk = require("chalk")
import { OptionItem } from "./config"
import { D } from "./lib/dict"
import { BranchAnswers } from "./question"

export const inspectBranchEquivalance = (configTerm: OptionItem, branchModel: BranchAnswers) => {
    const termInspectResult = Boolean(
        configTerm.optional ||
        (branchModel[configTerm.name] && new RegExp(configTerm.regExp).test(configTerm.prefix + branchModel[configTerm.name]))
    )
    if (!termInspectResult) {
        return D.BRANCH_FAIL.replace(
            '__BRANCH_OPTION__',
            chalk.green(chalk.bold(configTerm.name))
        ).replace(
            '__PARSED__',
            chalk.underline(chalk.bold(configTerm.prefix + branchModel[configTerm.name]))
        ).replace(
            '__REQUIRED__',
            chalk.red(chalk.bold(configTerm.regExp))
        )
    }
    return null
}