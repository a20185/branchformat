import { D } from "src/lib/dict";
import { prepareBranchLists } from "./branch";

const Inquirer = require('inquirer')
Inquirer.registerPrompt('search-list', require('inquirer-search-list'));


export const prepareQuestions = () => {
    const availableBranchs = prepareBranchLists()
    return [
        {
            type: "search-list",
            message: D.SWITCH_TTLE,
            name: "branch",
            choices: availableBranchs,
            default: availableBranchs[0]
        }
    ]
}

export const getCheckoutBranch = async () => {
    const question = prepareQuestions()
    const result = await Inquirer.prompt(question)
    return result.branch
}