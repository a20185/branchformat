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

export const performCheckout = (branchName: string) => {
    Shell.exec('git stash', { silent: true })
    Shell.exec(`git checkout ${branchName}`, { silent: true })
    Shell.exec('git stash pop', { silent: true })
}