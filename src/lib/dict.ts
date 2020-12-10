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
    HINT_SAMEBR: '切出前后分支相同，您本次操作将不会产生效果...'
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
    HINT_SAMEBR: 'Same branch before and after checkout, it won\'t take any effects...'
}


export const D = lang === 'zh' ? ZH_DICT : EN_DICT