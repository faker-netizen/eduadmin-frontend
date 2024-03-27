# 教务系统前端（新）

采用 Umi/Max 框架搭建教务系统前端

## 运行

安装依赖

```shell
$ npm install
```

启动服务

```shell
$ npm start
```

## 构建

```shell
$ npm run build
```

构建完成后，会在 dist 目录下生成构建产物。

## AntD v4/v5

项目默认使用 Ant Design V5，如需使用 Ant Design V4，请执行以下命令：

```shell
$ npm install antd@4
```

然后重新启动服务即可。

若需切回 Ant Design V5，请执行以下命令：

```shell
$ npm install antd@5
```

然后重新启动服务即可。

如运行上述命令后，发现 Ant Design V5 依然未生效，请删除 node_modules 目录、src/.umi 目录和 package-lock.json 文件，然后重新安装依赖。
