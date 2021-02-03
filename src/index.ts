import { getCurrentBranch, isBranchShouldParse, parseExistedBranch } from './branch';
import { getCurrentConfig } from './config';
import { modifyBranch } from './modify';
import { askQuestions } from './question';
import { updateNotice } from "./update";
import { switchBranch as _switchBranch } from './switch'
const rcfile = require('rcfile')
const path = require('path')
const os = require('os')
const fs = require('fs')
const pkgJsonPath = path.join('..', 'package.json')
const updateRcPath = path.join(os.homedir(), '.bfrc')

/**
 * BranchFormat API
 * @export
 * @param {string} directoryPath yourCurrentWorkingDirectory
 * @returns {Promise<boolean>} BranchFormat result
 */
export async function performFormat(directoryPath: string) {
    await updateNotice(pkgJsonPath, updateRcPath)
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
    await modifyBranch(result, configs, currentBranch, rcConfig?.skip)
    return true
}

/**
 * BranchVerification API
 * @export
 * @param {string} directoryPath yourWorkingDirectory
 * @returns {Promise<boolean>} Branch Validation Result
 */
export async function isCurrentBranchValid(directoryPath: string) {
    await updateNotice(pkgJsonPath, updateRcPath)
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
    /** avoid detached HEAD state verifications */
    if (!currentBranch) {
        return true
    }
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

/**
 * BranchSwitching API
 * @export
 * @returns {Promise<void>}
 */
export async function switchBranch () {
    await updateNotice(pkgJsonPath, updateRcPath)
    const result = await _switchBranch()
    return result
}

/**
 * Extract params from a given branch
 * Followed the regulations defined
 * by users' branchFormat.config.js
 * @export
 * @param {string} directoryPath currentWorkingDirectory
 * @param {string} [targetBranch] targetBranch, defaultly current branch
 * @returns {Promise<BranchAnswers | null>} current branch parsing result
 */
export async function extractBranchParams (directoryPath: string, targetBranch?: string) {
    await updateNotice(pkgJsonPath, updateRcPath)
    /** rcPath */
    const rcConfig = rcfile('branchformat', {
        cwd: directoryPath,
        configFileName: 'branchformat.config.js',
        defaultExtension: '.js'
    })
    /** get configs */
    const configs = getCurrentConfig(rcConfig?.config ?? [])
    const testBranch = targetBranch ?? getCurrentBranch()
    if (!testBranch || !isBranchShouldParse(testBranch, rcConfig?.skip)) return null
    return parseExistedBranch(
        testBranch,
        configs,
        rcConfig?.skip
    )
}