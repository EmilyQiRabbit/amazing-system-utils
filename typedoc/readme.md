# Typedoc

[官网](https://typedoc.org/)

### 配置方法：

**1. 引包：**

```sh
yarn add --dev typedoc typedoc-plugin-markdown
```

**2. 配置 tsconfig.json：**

```json
{
  "typedocOptions": {
    "out": "docs",
    "mode": "modules",
    "includeDeclarations": true,
    "excludeExternals": true,
    "excludeNotExported": true,
    "excludeProtected": true,
    "excludePrivate": true,
    "inputFiles": ["./src"],
    "includes": ["src/**/*"],
    "exclude": [
      "src/**/__tests__/*",
      "src/__mocks__/*",
      "src/docs/*"
    ],
    "plugin": "typedoc-plugin-markdown",
    "readme": "./README.md",
    "logger": true,
    "ignoreCompilerErrors": true
  }
}
```

**3. 配置脚本：**

```json
"scripts": {
    "docs": "rm -rf ./docs && typedoc --tsconfig ./tsconfig.json"
}
```

**4. 配置 ci 以及部署/上传脚本**

...
