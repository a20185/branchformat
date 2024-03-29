export const lang = process.env.LANG?.startsWith('zh') ? 'zh' : 'en'

const ZH_DICT = {
    UPDATE_CLOG: '更新内容如下：',
    UPDATE_HINT: '__PKG_NAME__ 新版本 __L_T_VER__ 已经发布, 运行以下命令，立即更新到最新版吧 \n\nnpm i __PKG_NAME__ -D \nyarn add __PKG_NAME__ --dev',
    CONFIG_TTLE: '分支切出助手（任意输入项填入「no」将等同于不填写）',
    CONFIG_DEFH: '请输入 __ITM_NAME__ :',
    CONFIG_DESC: '请输入需求/修复的相关描述（建议小于 30 字）：',
    CONFIG_TYPE: '请选择分支类型（默认：feature）：',
    CONFIG_SWIM: '请输入使用的泳道名称（例如 1787-qkgku、ouyifeng-hhhhh 等）：',
    CONFIG_SUBP: '请输入子目录名称（例如 product-gx 等）：',
    CONFIG_BIZK: '请输入业务变量名称（例如 AgentOrder 等）：',
    CONFIG_REID: '请输入关联ID（例如 ones-xxx, km-xxx, tt-xxx）：',
    ANSWER_CONF: '确认吗（Y/n）?',
    ANSWER_LIST: '您当前填写的信息如下：',
    ANSWER_FAIL: '❌ 分支选项 __OPTION__ 不符合要求格式 __REQ_REG__，验证失败。(当前填写为 __VALUE__)',
    ANSWER_RMBR: '是否要删除原分支（Y/n）？',
    HINT_NODESC: '缺少分支类型和分支描述，请重新检查！',
    HINT_MUSTOP: '必填选项 __MUST_OP__ 未填写，请重新检查！',
    HINT_MUSTDS: '创建的分支不合法，已退出',
    HINT_PRECKO: '切出的目标分支为 __TGT_BR__',
    HINT_STSING: '正在保存当前分支状态...',
    HINT_CHKING: '正在切出新分支...',
    HINT_CHKEND: '分支切出完成, 开始设置 upstream 并做初始化推送...',
    HINT_UPSEND: '设置 upstream 完成...',
    HINT_RMBEND: '本地及远程的原始分支已移除...',
    HINT_ALLEND: '🍻全部完成！',
    HINT_SAMEBR: '切出前后分支相同，您本次操作将不会产生效果...',
    SWITCH_INTR: '分支切换助手',
    SWITCH_SETR: '请输入关键字搜索分支, 方向键选择分支，回车执行分支切出...',
    SWITCH_TTLE: '输入关键字：',
    SWITCH_SUCC: '🍻 分支切换成功！',
    SWITCH_FAIL: '❌ 分支切换失败，请选择分支！',
    BRANCH_FAIL: '❌ __BRANCH_OPTION__ 校验失败！您填写的值 __PARSED__ 无法满足您配置的分支格式 __REQUIRED__',
    BRRESU_SUCC: '分支校验结果：成功 ✅',
    BRRESU_FAIL: '分支校验结果：失败 ❌',
    BRRESU_REST: '详细错误情况：',
    BRVALI_RESU: '未切出',
    BRVALI_EXIT: '❌ 您填写的属性不满足项目指定的校验规则！请注意当前分支 __RESULT__！',
    BRVALI_HITX: '验证失败！',
    BRVALI_HINT: '❌ 自定义校验规则 __RESULT__!'
}

const EN_DICT = {
    UPDATE_CLOG: 'Version update brought changes as below: ',
    UPDATE_HINT: 'Version __L_T_VER__ of __PKG_NAME__ is out, run the following command for upgrade \n\nnpm i __PKG_NAME__ -D \nyarn add __PKG_NAME__ --dev',
    CONFIG_TTLE: 'Branch format switcher (Input \'no\' at any input term will erase the result)',
    CONFIG_DEFH: 'Input __ITM_NAME__ :',
    CONFIG_DESC: 'Brief descriptions (less than 30 letters) :',
    CONFIG_TYPE: 'Select branch type (default：feature) :',
    CONFIG_SWIM: 'Input swimlane (E.g. 1787-qkgku、ouyifeng-hhhhh) :',
    CONFIG_SUBP: 'Input subpackage (E.g. product-gx ) :',
    CONFIG_BIZK: 'Input businesskey (E.g. AgentOrder) :',
    CONFIG_REID: 'Input reference ID (E.g. ones-xxx, km-xxx, tt-xxx) :',
    ANSWER_CONF: 'Proceed (Y/n) ?',
    ANSWER_LIST: 'Collected branch informations: ',
    ANSWER_FAIL: '❌ Inputed option `__OPTION__` fails to match required format __REQ_REG__ (Your current value `__VALUE__`)',
    ANSWER_RMBR: 'Delete origin checkouted branch (Y/n) ?',
    HINT_NODESC: 'Missing BranchType and BranchDescription, program exited.',
    HINT_MUSTOP: 'Required item __MUST_OP__ is missing.',
    HINT_MUSTDS: 'Program exited because of the created branch is invalid',
    HINT_PRECKO: 'Branch to be checkout is __TGT_BR__',
    HINT_STSING: 'Saving current branch state...',
    HINT_CHKING: 'Checking out new branch...',
    HINT_CHKEND: 'Branch checkout completed, setting up upstream with initial push...',
    HINT_UPSEND: 'Upstream setting completed...',
    HINT_RMBEND: 'Removed source branch locally and remotedly...',
    HINT_ALLEND: '🍻All done！',
    HINT_SAMEBR: 'Same branch before and after checkout, it won\'t take any effects...',
    SWITCH_INTR: 'Branch switch helper',
    SWITCH_SETR: 'Input keyword for branch searching, arrow key for selection, enter to perform checkout...',
    SWITCH_TTLE: 'Branch keyword: ',
    SWITCH_SUCC: '🍻 Branch switched successfully！',
    SWITCH_FAIL: '❌ Branch switch error, please make sure any branch has selected！',
    BRANCH_FAIL: '❌ __BRANCH_OPTION__ validate failed since parsed value __PARSED__ does not matched your config format __REQUIRED__',
    BRRESU_SUCC: 'Branch verify result：PASSED ✅',
    BRRESU_FAIL: 'Branch verify result：FAILED ❌',
    BRRESU_REST: 'Errors in detail: ',
    BRVALI_RESU: 'has NOT created',
    BRVALI_EXIT: '❌ Customize verification failed! Please note that your branch __RESULT__!',
    BRVALI_HITX: 'validate FAILED',
    BRVALI_HINT: '❌ Customize verification function __RESULT__!'
}


export const D = lang === 'zh' ? ZH_DICT : EN_DICT

export const STASHERROR_ZH = '没有要保存的本地修改'
export const STASHERROR_EN = 'No local changes to save'