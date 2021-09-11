import { getCurrentBranch, isBranchShouldParse, parseExistedBranch } from './branch';
import { getCurrentConfig, OptionItem } from './config';
import { modifyBranch } from './modify';
import { askQuestions, BranchAnswers } from './question';
import { updateNotice } from "./update";
import { switchBranch as _switchBranch } from './switch'
import { D } from './lib/dict';
import { inspectBranchEquivalance } from './inspect';
import { checkVerificationErrors } from './verify';
const chalk = require('chalk')
const rcfile = require('rcfile')
const path = require('path')
const os = require('os')
const fs = require('fs')
const pkgJsonPath = path.join('..', 'package.json')
const updateRcPath = path.join(os.homedir(), '.bfrc')

/**
 * 分支切换 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支切换结果
 */
export async function performFormat(directoryPath: string) {
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
    const branchModel = parseExistedBranch(currentBranch, configs, rcConfig?.skip)
    /** prepare questions */
    const result = await askQuestions(configs, branchModel)
    /** Perform user validation */
    const validationError = checkVerificationErrors(result, rcConfig)
    if (validationError) {
        console.log(validationError)
        console.log(D.BRVALI_EXIT.replace('__RESULT__', chalk.bold(chalk.cyan(chalk.underline(D.BRVALI_RESU)))))
        return false
    }
    console.log(D.BRRESU_SUCC)
    // /** write target branch */
    await modifyBranch(result, configs, currentBranch, rcConfig?.skip)
    return true
}

/**
 * 分支合法性校验 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支校验结果
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
    const errors: string[] = []
    const parsedResult = configs.every(config => {
        /** if is optional, or is filled with value and match regex */
        const termInspectResult = inspectBranchEquivalance(config, branchModel)
        if (termInspectResult) {
            errors.push(termInspectResult)
        }
        return !termInspectResult
    })
    console.log(parsedResult ? D.BRRESU_SUCC : D.BRRESU_FAIL)
    if (!parsedResult) {
        console.log('----------------------------------------------------------------')
        console.log(D.BRRESU_REST)
        errors.forEach(result => console.log(result))
        return parsedResult
    }
    /** Perform user validation */
    const validationError = checkVerificationErrors(branchModel, rcConfig)
    if (validationError) {
        console.log(validationError)
        console.log(D.BRVALI_HINT.replace('__RESULT__', chalk.bold(chalk.cyan(chalk.underline(D.BRVALI_HITX)))))
        return false
    }
    console.log(D.BRRESU_SUCC)
    return parsedResult
}

/**
 * 分支快速切换 API
 * @export
 * @returns {Promise<void>}
 */
export async function switchBranch () {
    await updateNotice(pkgJsonPath, updateRcPath)
    const result = await _switchBranch()
    return result
}

/**
 * 根据当前的 branchFormat 配置
 * 从给定分支中提取参数
 * @export
 * @param {string} directoryPath 当前项目目录
 * @param {string} [targetBranch] 目标分支，默认为当前分支
 * @returns {Promise<BranchAnswers | null>} 当前分支解析结果，如果分支不存在或需跳过则为空
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

/**
 * [同步 API]
 * 根据当前的 branchFormat 配置
 * 从给定分支中提取参数
 * @export
 * @param {string} directoryPath 当前项目目录
 * @param {string} [targetBranch] 目标分支，默认为当前分支
 * @returns {Promise<BranchAnswers | null>} 当前分支解析结果，如果分支不存在或需跳过则为空
 */
export function extractBranchParamsSync (directoryPath: string, targetBranch?: string) {
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

/**
 * [同步 API]
 * 分支合法性校验 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支校验结果
 */
 export function isCurrentBranchValidSync(directoryPath: string) {
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
    const errors: string[] = []
    const parsedResult = configs.every(config => {
        /** if is optional, or is filled with value and match regex */
        const termInspectResult = inspectBranchEquivalance(config, branchModel)
        if (termInspectResult) {
            errors.push(termInspectResult)
        }
        return !termInspectResult
    })
    console.log(parsedResult ? D.BRRESU_SUCC : D.BRRESU_FAIL)
    if (!parsedResult) {
        console.log('----------------------------------------------------------------')
        console.log(D.BRRESU_REST)
        errors.forEach(result => console.log(result))
        return parsedResult
    }
    /** Perform user validation */
    const validationError = checkVerificationErrors(branchModel, rcConfig)
    if (validationError) {
        console.log(validationError)
        console.log(D.BRVALI_HINT.replace('__RESULT__', chalk.bold(chalk.cyan(chalk.underline(D.BRVALI_HITX)))))
        return false
    }
    console.log(D.BRRESU_SUCC)
    return parsedResult
}