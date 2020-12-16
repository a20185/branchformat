import chalk from "chalk"
import { D } from "src/lib/dict"
import { performCheckout, prepareBranchLists } from "./branch"
import { getCheckoutBranch } from "./question"
const Chalk = require('chalk')

export const switchBranch = async () => {
    console.log(Chalk.green(D.SWITCH_INTR))
    console.log(Chalk.green(D.SWITCH_SETR))
    console.log()
    const checkoutBranch = await getCheckoutBranch()
    if (checkoutBranch) {
        performCheckout(checkoutBranch)
        console.log(Chalk.green(D.SWITCH_SUCC))
        return true
    }
    console.log(Chalk.red(D.SWITCH_FAIL))
    return false
}