import { fetchData } from "./lib/http"
import { prerelease, gt } from 'semver'
const Chalk = require('chalk')
const Shell = require('shelljs')
const fs = require('fs')
let npmMirror = 'http://registry.npmjs.org/'
const DEFAULT_VALIDATE_REMAINS = 20

interface BranchFormatRcType {
    validateRemain: number
}

const isRcValid = (rcFile: any): rcFile is BranchFormatRcType => {
    if (!rcFile) return false
    if (!rcFile.validateRemain || !Number.isInteger(rcFile.validateRemain)) return false
    return true
}

const getRcContent = (rcPath: string): BranchFormatRcType => {
    const rcExists = fs.existsSync(rcPath)
    const defaultRcResult = {
        validateRemain: DEFAULT_VALIDATE_REMAINS
    }
    if (rcExists) {
        try {
            const rcContent = JSON.parse(fs.readFileSync(rcPath, { encoding: 'utf8' }))
            if (isRcValid(rcContent)) return rcContent
            return defaultRcResult
        } catch (err) {
            return defaultRcResult
        }
    }
    return defaultRcResult
}

const checkShouldUpdate = (rcPath: string) => {
    const rcContent = getRcContent(rcPath)
    if (rcContent.validateRemain === 0) {
        rcContent.validateRemain = DEFAULT_VALIDATE_REMAINS
        fs.writeFileSync(rcPath, JSON.stringify(rcContent, null, 2), { encoding: 'utf8' })
        return true
    }
    rcContent.validateRemain -= 1
    fs.writeFileSync(rcPath, JSON.stringify(rcContent, null, 2), { encoding: 'utf8' })
    return false
}

const getNpmMirror = () => {
    try {
        const mirrorResult = Shell.exec('npm config get registry', { silent: true })
        npmMirror = mirrorResult.stdout.trim()
    } catch (err) {
        npmMirror = 'http://registry.npmjs.org/'
    }
}

const getProperNpmListPath = (packageName: string): string => {
    const hasNpmMirror = npmMirror !== 'http://registry.npmjs.org/'
    if (hasNpmMirror) {
        return `${npmMirror}${packageName}`
    }
    return `http://registry.npmjs.org/${packageName}`
}

const getLocalMessage = (packageName: string, latestVersion: string, originMessage?: string): string => {
    return (
        originMessage ||
        `${packageName} 新版本 __L_T_VER__ 已经发布, 运行以下命令，立即更新到最新版吧 \n\nnpm i ${packageName} -D \nyarn add ${packageName} --dev`
    ).replace('__L_T_VER__', latestVersion)
}

export const updateNotice = async (packagePath: string, rcPath: string, message?: string) => {
    if (!checkShouldUpdate(rcPath)) return false
    try {
        const pkg = require(packagePath)
        const localVersion = pkg.version
        getNpmMirror()
        /** FetchData */
        const npmData = await fetchData(getProperNpmListPath(pkg.name))
        const latestVersion = npmData['dist-tags']?.latest
        if (!latestVersion || latestVersion === localVersion) return false
        /** Do nothing if user uses prerelease versions */
        if (prerelease(localVersion)) return false
        /** Only build notice when latestVersion is greater than localVersion */
        if (gt(latestVersion, localVersion)) {
            const displayMessage = getLocalMessage(pkg.name ,latestVersion, message)
            console.log(Chalk.green(displayMessage))
            console.log()
            return {
                message: displayMessage,
                name: pkg.name,
                local: localVersion,
                latest: latestVersion
            }
        }
    } catch (err) {
        console.log(Chalk.red(err.message))
        return false
    }
}

