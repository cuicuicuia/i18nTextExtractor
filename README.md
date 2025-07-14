# i18nTextExtractor
i18n 提取 vue 模版里面的文字为后续的翻译做准备
/**
 * i18n 文本提取工具
 *
 * 功能：
 * 1. 递归扫描指定目录下的所有 .vue 文件
 * 2. 提取 <template> 标签中的文本内容
 * 3. 将文本转换为国际化 key-value 格式
 * 4. 生成对应的 .ts 语言文件
 *
 * 配置说明：
 * - [ROOT_DIR](src/i18n-text-extractor.js#L4-L4): 要扫描的 Vue 项目源代码目录 (默认: '../src')
 * - [OUTPUT_DIR](src/i18n-text-extractor.js#L5-L5): 生成的 .ts 文件输出目录 (默认: './lang/locales')
 *
 * 生成规则：
 * 1. 提取 >文本< 形式的纯文本内容
 * 2. 自动转换 {{ variable }} 为 {variable} 格式
 * 3. 自动生成唯一 key (基于文本最后单词或序号)
 * 4. 重复文本会添加 _1, _2 等后缀区分
 *
 * 使用方式：
 * 1. 确保项目已安装 Node.js
 * 2. 修改配置常量后直接运行脚本
 * 3. 生成的 .ts 文件会保持与源文件相同的目录结构
 *
 * 输出示例：
 * export default = {
 *   hello: `你好`,
 *   welcomeUser: `欢迎 {userName}`,
 *   buttonText: `点击这里`
 * };
 *
 * 注意：
 * - 仅处理 <template> 中的文本
 * - 生成的 key 可能需要手动调整语义
 * - 建议在语言目录下按语言分目录 (如 en/, zh/)
 * - 脚本放在src目录下
 * - ${}不给予匹配
 * - {{ }} 会转化为{ }
 * - author: CalmSeas
 */
