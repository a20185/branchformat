import { BranchformatConfigModel } from "./config";
import { D } from "./lib/dict";
import { BranchAnswers } from "./question";

/**
 * 校验验证错误
 * @export
 * @param {BranchAnswers} branchAnswers
 * @param {BranchformatConfigModel} branchConfig
 * @returns
 */
export function checkVerificationErrors (branchAnswers: Partial<BranchAnswers>, branchConfig: BranchformatConfigModel) {
    if (typeof branchConfig?.verify === 'function') {
        try {
            const verifyResult = branchConfig?.verify(branchAnswers)
            if (verifyResult === true) return false
            if (verifyResult === false) return D.BRRESU_FAIL
            return D.BRRESU_FAIL + ': ' + verifyResult
        } catch (err: any) {
            return `${D.BRRESU_FAIL}: 校验函数调用失败！
                ${err.message}
            `
        }
    }
    return false
}