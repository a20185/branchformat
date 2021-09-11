interface BranchAnswers {
    type: string;
    swimlane: string;
    packageName: string;
    businessKey: string;
    id: string;
    desc: string;
    [x: string]: string;
}

/**
 * 分支切换 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支切换结果
 */
declare function performFormat(directoryPath: string): Promise<boolean>;
/**
 * 分支合法性校验 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支校验结果
 */
declare function isCurrentBranchValid(directoryPath: string): Promise<boolean>;
/**
 * 分支快速切换 API
 * @export
 * @returns {Promise<void>}
 */
declare function switchBranch(): Promise<boolean>;
/**
 * 根据当前的 branchFormat 配置
 * 从给定分支中提取参数
 * @export
 * @param {string} directoryPath 当前项目目录
 * @param {string} [targetBranch] 目标分支，默认为当前分支
 * @returns {Promise<BranchAnswers | null>} 当前分支解析结果，如果分支不存在或需跳过则为空
 */
declare function extractBranchParams(directoryPath: string, targetBranch?: string): Promise<BranchAnswers | null>;
/**
 * [同步 API]
 * 根据当前的 branchFormat 配置
 * 从给定分支中提取参数
 * @export
 * @param {string} directoryPath 当前项目目录
 * @param {string} [targetBranch] 目标分支，默认为当前分支
 * @returns {Promise<BranchAnswers | null>} 当前分支解析结果，如果分支不存在或需跳过则为空
 */
declare function extractBranchParamsSync(directoryPath: string, targetBranch?: string): BranchAnswers | null;
/**
 * [同步 API]
 * 分支合法性校验 API
 * @export
 * @param {string} directoryPath 当前项目目录
 * @returns {Promise<boolean>} 分支校验结果
 */
declare function isCurrentBranchValidSync(directoryPath: string): boolean;

export { extractBranchParams, extractBranchParamsSync, isCurrentBranchValid, isCurrentBranchValidSync, performFormat, switchBranch };
