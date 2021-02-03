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
 * BranchFormat API
 * @export
 * @param {string} directoryPath yourCurrentWorkingDirectory
 * @returns {Promise<boolean>} BranchFormat result
 */
declare function performFormat(directoryPath: string): Promise<boolean>;
/**
 * BranchVerification API
 * @export
 * @param {string} directoryPath yourWorkingDirectory
 * @returns {Promise<boolean>} Branch Validation Result
 */
declare function isCurrentBranchValid(directoryPath: string): Promise<boolean>;
/**
 * BranchSwitching API
 * @export
 * @returns {Promise<void>}
 */
declare function switchBranch(): Promise<boolean>;
/**
 * Extract params from a given branch
 * Followed the regulations defined
 * by users' branchFormat.config.js
 * @export
 * @param {string} directoryPath currentWorkingDirectory
 * @param {string} [targetBranch] targetBranch, defaultly current branch
 * @returns {Promise<BranchAnswers | null>} current branch parsing result
 */
declare function extractBranchParams(directoryPath: string, targetBranch?: string): Promise<BranchAnswers | null>;

export { extractBranchParams, isCurrentBranchValid, performFormat, switchBranch };
