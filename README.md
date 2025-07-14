#  i18n Text Extractor for Vue

> 自动提取 Vue `<template>` 中的文本，并生成国际化语言文件（`.ts` 格式）

![Node.js](https://img.shields.io/badge/node-%3E%3D14.0-blue)
![Vue](https://img.shields.io/badge/vue-2.x%2F3.x-green)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ 功能特性

- ✅ 递归扫描指定目录下所有 `.vue` 文件
- ✅ 提取 `<template>` 标签中的纯文本内容
- ✅ 自动转义插值表达式：`{{ variable }}` → `{variable}`
- ✅ 自动生成唯一的 i18n key，重复项自动添加后缀 `_1`, `_2`
- ✅ 保持输出目录结构与源文件一致，支持多语言目录分离

---

## ⚙️ 配置说明

在 [`src/i18n-text-extractor.js`](src/i18n-text-extractor.js) 文件顶部可以配置：

```js
const ROOT_DIR   = path.resolve(__dirname, '../src');          // 项目源代码目录
const OUTPUT_DIR = path.resolve(__dirname, './lang/locales');  // 输出 .ts 文件目录


🚀 使用方式
安装 Node.js（建议 ≥ v14）

克隆项目并进入目录

修改配置路径

执行脚本：

node src/i18n-text-extractor.js
运行后将在 lang/locales/ 下生成 .ts 文件，结构与源文件一致。


📄 输出示例
export default {
  hello: `你好`,
  welcomeUser: `欢迎 {userName}`,
  buttonText: `点击这里`,
};

📌 注意事项
仅提取 <template> 标签中的文本

插值表达式 {{ }} 会自动转换为 { }

不会匹配 ${} 形式

key 名自动生成，可能需手动调整语义

👤 作者
CalmSeas

欢迎提 Issue 或 PR 优化本工具！


---

如果你后续还会写 `.csv ↔ .ts` 的转换脚本，可以再一起加上国际化全流程文档支持，随时告诉我来一起完善~

