import { OptionItem } from './config'
import { BranchAnswers } from './question'
const Shell = require('shelljs')

const defaultSkipbranch = ['master', 'staging']

const getParsingPhases = (config: readonly OptionItem[]) => {
    /** Final not use */
    return config.slice(0, -1)
}

const isBranchShouldParse = (branch: string, skipBranch: string[]) => {
    if (skipBranch.find((current) => branch === current)) {
        return false
    }
    return true
}

export const getCurrentBranch = () => {
    const branch = Shell.exec('git symbolic-ref --short -q HEAD')
    return branch
}

/** 获取当前分支名称 */
export const parseExistedBranch = (currentBranch: string, config: readonly OptionItem[], skipBranchs: string[] = defaultSkipbranch): BranchAnswers => {
    /** 使用正则匹配当前分支是否合法，以及具备什么信息 */
    const parsingPhases = getParsingPhases(config)
    /** 根据斜杠做切割 */
    const branchSlices = currentBranch.split('/')

    const restFeatures = []
    let parsingIndex = 0
    const parseResult = {} as BranchAnswers

    /** Setup initial value */
    config.forEach(option => {
        parseResult[option.name] = ''
    })

    if (!isBranchShouldParse(currentBranch, skipBranchs)) {
        return parseResult
    }

    /** 从头到尾 parse */
    while (branchSlices.length && parsingIndex < parsingPhases.length) {
      const brResult = branchSlices.pop() as string
      let matchResult = null
      let targetIndex = 0
      /** 从前往后看看那个匹配上了 */
      for (let idx = parsingIndex; idx < parsingPhases.length; idx++) {
        targetIndex = idx
        const parsingRegex = parsingPhases[targetIndex]
        const matcher = brResult.match(new RegExp(parsingRegex.regExp))
        /** 匹配上了，或者不允许跳过 */
        if (matcher || !parsingRegex.optional) {
          matchResult = matcher
          break
        }
      }
  
      /** 回退一个 */
      if (targetIndex === parsingPhases.length) {
        targetIndex -= 1
      }
  
      if (matchResult) {
        /** 匹配上了，记录，然后更新 */
        parseResult[parsingPhases[targetIndex].name] = matchResult[1]
      } else {
        /** 说明到最后一个都匹配不上 */
        for (let pos = parsingIndex; pos <= targetIndex; pos++) {
          restFeatures.push(brResult)
        }
      }
      parsingIndex = targetIndex
    }
    parseResult.desc = restFeatures.join('')
    return parseResult
  }