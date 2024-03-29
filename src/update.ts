import { fetchData } from "./lib/http"
import { D, lang } from './lib/dict'
const Semver = require('semver')
const Chalk = require('chalk')
const Shell = require('shelljs')
const fs = require('fs')
const defaultNpmMirror = 'http://registry.npmjs.org/'
const defaultYarnMirror = 'https://registry.yarnpkg.com/'
const sankuaiMirror = 'http://r.npm.sankuai.com/'
let npmMirror = defaultNpmMirror
const DEFAULT_VALIDATE_REMAINS = 20

interface BranchFormatRcType {
    validateRemain: number
}

const isRcValid = (rcFile: any): rcFile is BranchFormatRcType => {
    if (!rcFile) return false
    if (!Number.isInteger(rcFile.validateRemain)) return false
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
        npmMirror = defaultNpmMirror
    }
}

const getProperNpmListPath = (packageName: string): string => {
    const hasNpmMirror =
        npmMirror !== defaultNpmMirror &&
        npmMirror !== defaultYarnMirror
    if (hasNpmMirror) {
        return `${npmMirror}${packageName}`
    }
    return `${defaultNpmMirror}${packageName}`
}

const getLocalMessage = (packageName: string, latestVersion: string, originMessage?: string): string => {
    return (
        originMessage ||
        D.UPDATE_HINT
    ).replace('__L_T_VER__', latestVersion).replace(/__PKG_NAME__/g, packageName)
}

const getUpdateLogs = (npmData: any, currentVersion: string, latestVersion: string) => {
    if (Semver.prerelease(currentVersion) || !Semver.gt(latestVersion, currentVersion)) {
        return ''
    }
    /** parse version lists */
    const upcomingVersions = (Object.keys(npmData.versions || {}) as string[])
        .filter(incomingVersion =>
            Boolean(
                /** not prerelease */
                !Semver.prerelease(incomingVersion) &&
                /** larger than currentVersion */
                Semver.gt(incomingVersion, currentVersion) &&
                /** less or equal to latestVersion */
                Semver.lte(incomingVersion, latestVersion)
            )
        )
        .sort((versionA, versionB) => Semver.lte(versionA, versionB) ? -1 : 1)
    /** output version changelogs */
    return upcomingVersions.map(version => {
        const changelog = lang === 'zh'
            ? npmData.versions?.[version]?.config.changelog
            : npmData.versions?.[version]?.config.enchangelog
        if (changelog) {
            return `[${version}]: ${changelog}`
        }
        return ''
    }).filter(Boolean).join('\n')
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
        if (Semver.prerelease(localVersion)) return false
        /** Only build notice when latestVersion is greater than localVersion */
        if (Semver.gt(latestVersion, localVersion)) {
            const displayMessage = getLocalMessage(pkg.name ,latestVersion, message)
            const changelogs = getUpdateLogs(npmData, localVersion, latestVersion)
            console.log(Chalk.green(displayMessage))
            if (changelogs) {
                console.log()
                console.log(Chalk.cyan(D.UPDATE_CLOG))
                console.log(Chalk.white(changelogs))
            }
            console.log()
            return {
                message: displayMessage,
                name: pkg.name,
                local: localVersion,
                latest: latestVersion
            }
        }
    } catch (err: any) {
        console.log(Chalk.red(err.message))
        return false
    }
}

