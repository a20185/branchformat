import { fetchData } from "./lib/http"
import { prerelease, gt } from 'semver'
const Chalk = require('chalk')
const Shell = require('shelljs')

let npmMirror = 'http://registry.npmjs.org'

const getNpmMirror = () => {
    try {
        const mirrorResult = Shell.exec('npm config get registry')
        npmMirror = mirrorResult
    } catch (err) {
        npmMirror = 'http://registry.npmjs.org'
    }
}

const getProperNpmListPath = (packageName: string): string => {
    const hasNpmMirror = npmMirror !== 'http://registry.npmjs.org'
    if (hasNpmMirror) {
        return `${npmMirror}/${packageName}`
    }
    return `http://registry.npmjs.org/${packageName}`
}

const getLocalMessage = (packageName: string, latestVersion: string, originMessage?: string): string => {
    return (
        originMessage ||
        `${packageName} 新版本 __L_T_VER__ 已经发布, 运行以下命令，立即更新到最新版吧 \n\nnpm i -g ${packageName} \nyarn add -g ${packageName} \n`
    ).replace('__L_T_VER__', latestVersion)
}


export const updateNotice = async (packagePath: string, message?: string) => {
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
            console.log()
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

