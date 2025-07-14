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

const fs   = require('fs');
const path = require('path');

// ---------- 配置 ----------
const ROOT_DIR    = path.resolve(__dirname, '../src');     // 要遍历的根目录
const OUTPUT_DIR  = path.resolve(__dirname, './lang/locales');   // .ts 输出目录 一般在后面加一个 en zh 等语言
// ----------------------------------

// 递归获取目录下全部 .vue 文件
function getVueFiles(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getVueFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.vue')) {
      files.push(fullPath);
    }
  }
  return files;
}

// 提取所有 <template> 标签内容（包括具名插槽）
function getAllTemplateContent(html) {
  const templates = [...html.matchAll(/<template(?:\s+[^>]*)?>([\s\S]*?)<\/template>/gi)];
  return templates.map(m => m[1]).join('\n');
}

// 提取文本，生成合法唯一 key 的对象
function extractTextToObj(html) {
  const lines = [...html.matchAll(/>([^<>]+?)</g)].map(m => m[1].trim()).filter(Boolean);
  const result = {};
  const keyCount = {};

  lines.forEach((line, index) => {
    let processedLine = line.replace(/{{\s*(.*?)\s*}}/g, '{$1}');
    const safeLine = processedLine.replace(/`/g, '\\`');

    let key = processedLine.split(/\s+/).pop().replace(/[^\w]/g, '');
    if (!key || /^\d/.test(key)) key = `w${index}`;

    if (result.hasOwnProperty(key)) {
      if (!keyCount[key]) keyCount[key] = 1;
      while (result.hasOwnProperty(`${key}_${keyCount[key]}`)) keyCount[key]++;
      key = `${key}_${keyCount[key]}`;
    }

    result[key] = `\`${safeLine}\``;
  });

  return result;
}

// 生成 .ts 文件内容
function generateTsContent(obj) {
  let ts = 'const documentation = {\n';
  for (const [k, v] of Object.entries(obj)) {
    ts += `  ${k}: ${v},\n`;
  }
  ts += '};\n\nexport default documentation;\n';
  return ts;
}

// 写入 .ts 文件
function writeToFile(outputPath, content) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf-8');
}

// 主流程
function main() {
  const vueFiles = getVueFiles(ROOT_DIR);
  if (!vueFiles.length) {
    console.warn('❗ 在指定目录下没找到 .vue 文件');
    return;
  }

  vueFiles.forEach(file => {
    const html = fs.readFileSync(file, 'utf-8');
    const template = getAllTemplateContent(html);
    if (!template) return;

    const obj = extractTextToObj(template);
    const tsContent = generateTsContent(obj);

    const relativePath = path.relative(ROOT_DIR, file).replace(/\.vue$/, '.ts');
    const outputPath = path.join(OUTPUT_DIR, relativePath);

    writeToFile(outputPath, tsContent);
    console.log(`✅ 已生成: ${outputPath}`);
  });
}

main();
