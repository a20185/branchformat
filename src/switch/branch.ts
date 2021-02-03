import { STASHERROR_EN, STASHERROR_ZH } from "src/lib/dict"

const Shell = require('shelljs')

export const getCurrentBranchLists = () => {
    const branchs = Shell.exec('git branch', { silent: true })
    return branchs.stdout.trim()
}

export const prepareBranchLists = () => {
    const branchs = getCurrentBranchLists().split('\n')
        .map((branch: string) => branch.trim())
        .filter((branchItem: string) => !branchItem.startsWith('*'))
    return branchs
}

/** 判断是否成功加入 stash */
const hasStashedSuccessfully = (stashOutput: string) => {
    if (
        stashOutput.indexOf(STASHERROR_EN) !== -1 ||
        stashOutput.indexOf(STASHERROR_ZH) !== -1
    ) {
        return false
    }
    return true
}

export const performCheckout = (branchName: string) => {
    const stashResult = Shell.exec('git stash --include-untracked', { silent: true })
    Shell.exec(`git checkout ${branchName}`, { silent: true })
    if (hasStashedSuccessfully(stashResult?.stdout?.trim())) {
        Shell.exec('git stash pop', { silent: true })
    }
}