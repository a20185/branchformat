import { getCurrentBranch, parseExistedBranch } from './branch';
import { getCurrentConfig } from './config';
import { modifyBranch } from './modify';
import { askQuestions } from './question';
import { updateNotice } from "./update";
const rcfile = require('rcfile')
const path = require('path')
const pkgJsonPath = path.join(process.cwd(), 'package.json')
console.log(process.cwd())

export async function performFormat(directoryPath: string) {
    await updateNotice(pkgJsonPath)
    /** subFolderName */
    const defaultSubPackage = directoryPath.split('/').pop()
    /** rcPath */
    const rcConfig = rcfile('branchformat', {
        cwd: directoryPath
    })
    /** get configs */
    const configs = getCurrentConfig(rcConfig)
    /** get current branch */
    const currentBranch = getCurrentBranch()
    const branchModel = parseExistedBranch(currentBranch, configs, rcConfig?.skip)
    /** prepare questions */
    const result = await askQuestions(configs, branchModel)
    /** write target branch */
    return modifyBranch(result, configs)
}
