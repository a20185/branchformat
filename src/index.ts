import { getCurrentBranch, isBranchShouldParse, parseExistedBranch } from './branch';
import { getCurrentConfig } from './config';
import { modifyBranch } from './modify';
import { askQuestions } from './question';
import { updateNotice } from "./update";
const rcfile = require('rcfile')
const path = require('path')
const pkgJsonPath = path.join(process.cwd(), 'package.json')

export async function performFormat(directoryPath: string) {
    await updateNotice(pkgJsonPath)
    /** subFolderName */
    const defaultSubPackage = directoryPath.split('/').pop()
    /** rcPath */
    const rcConfig = rcfile('branchformat', {
        cwd: directoryPath,
        configFileName: 'branchformat.config.js',
        defaultExtension: '.js'
    })
    /** get configs */
    const configs = getCurrentConfig(rcConfig?.config ?? [])
    /** get current branch */
    const currentBranch = getCurrentBranch()
    const branchModel = parseExistedBranch(currentBranch, configs, rcConfig?.skip)
    /** prepare questions */
    const result = await askQuestions(configs, branchModel)
    // /** write target branch */
    return modifyBranch(result, configs, currentBranch)
}


export async function isCurrentBranchValid(directoryPath: string) {
    await updateNotice(pkgJsonPath)
    /** rcPath */
    const rcConfig = rcfile('branchformat', {
        cwd: directoryPath,
        configFileName: 'branchformat.config.js',
        defaultExtension: '.js'
    })
    /** get configs */
    const configs = getCurrentConfig(rcConfig?.config ?? [])
    /** get current branch */
    const currentBranch = getCurrentBranch()
    /** Skip with skippable branches */
    if (!isBranchShouldParse(currentBranch, rcConfig?.skip)) {
        return true
    }
    const branchModel = parseExistedBranch(currentBranch, configs, rcConfig?.skip)
    /** Loop through branchModel and check if currentValid */
    return configs.every(config => {
        /** if is optional, or is filled with value */
        return Boolean(config.optional || branchModel[config.name])
    })
}