# nest-start 快速开发代码

## 介绍

基于 nestjs + typeorm + mysql + redis 编写的后端快速开发代码 （附 docker-compose 配置）

拥有错误拦截、jwt权限校验、参数校验等封装

已简单开发 权限、角色、用户 等模块

本项目使用 fastify 底层框架而非 express，如需后者，请按照 [nestjs 官方文档](https://docs.nestjs.com/techniques/performance#performance-fastify)替换

## 运行项目

### 没有 yarn 先安装 yarn

```bash
npm i yarn -g
```

### 第一步，进入目录安装依赖

```bash
yarn install
```

### 第二步，启动项目

```bash
# 开发环境
yarn run start:dev

# 生产环境
yarn run start:prod
```

## 打包

```bash
yarn run build
```

## 开发

## 请使用 yarn 安装其他包，不要使用 npm

```bash
yarn add 包名
```

## 如果想快速开发，可以装好 docker ，然后进入本项目 docker 文件夹执行

```bash
# 开启 docker 环境
docker-compose up -d

# 关闭 docker 环境
docker-compose down
```

## 相关目录说明

```basic
nest-start
|   dist （打包项目生成的文件夹）
|   docker （docker 相关 文件夹）
|     |
|     └───docker-mysql（mysql 相关）
|     |     |
|     |     └───conf (mysql 配置)
|     |     |
|     |     └───data（mysql 数据）
|     |     |
|     |     └───init（mysql 初始化语句）
|     |
|     └───docker-redis (redis 相关）
|     |     |
|     |     └───conf (redis 配置)
|     |     |
|     |     └───data（redis 数据）
|     |
|     └───.env (docker-compose 环境变量)
|     |
|     └───docker-compose.yml (docker-compose 配置)
|
|   src（主要代码区）
|     |
|     └───config (存放配置文件)
|     |     |
|     |     └───development.ts (开发环境配置)
|     |     |
|     |     └───production.ts (生产环境配置)
|     |     |
|     |     └───test.ts (测试环境配置)
|     |     |
|     |     └───index.ts (配置出口)
|     |
|     └───constants（存放常量)
|     |     |
|     |     └───meta.constant.ts（存放一些 redis key 和 reflect meta key）
|     |     |
|     |     └───text.constant.ts（存放一些文字常量）
|     |
|     └───decorators（自定义装饰器）
|     |     |
|     |     └───guard.decorator.ts（权限装饰器）
|     |     |
|     |     └───http.decorator.ts（响应装饰器）
|     |  
|     └───entities（存放数据表实体类，也就是数据模型）
|     |
|     └───enums（存放枚举类型）
|     |
|     └───errors（存放自定义错误构造器）
|     |
|     └───filters（存放全局错误过滤器）
|     |     |
|     |     └───error.filter.ts（用于重封装全局错误）
|     |
|     └───guards（存放守卫）
|     |     |
|     |     └───permission.guards.ts（权限守卫，配合权限装饰器用）
|     |
|     └───helper（助手工具）
|     |     |
|     |     └───cache（存放 redis 缓存模块）
|     |     |
|     |     └───common（常用函数)
|     |           |
|     |           └───common.controller.ts（常用控制器，其他控制器一般继承这个）
|     |           |
|     |           └───common.service.ts（常用服务，其他服务一般继承这个）
|     |           |
|     |           └───common.dto.ts（常用 dto）
|     |
|     └───interceptor（拦截器）
|     |     |
|     |     └───error.interceptor.ts（错误拦截器）
|     |     |
|     |     └───log.interceptor.ts（日志拦截器)
|     |     |
|     |     └───transform.interceptor.ts（响应转换拦截器，配合响应装饰器用)
|     |
|     └───interfaces（存放类型、接口）
|     |
|     └───middlewares（存放中间件）
|     |     |
|     |     └───decodeToken.middleware.ts（用于 token 解析的中间件）
|     |
|     └───modules（功能模块、主体）
|     |     |
|     |     └───user（用户模块）
|     |     |
|     |     └───role（角色模块）
|     |     |
|     |     └───permission（权限模块）
|     |     |
|     |     └───auth（权限认证模块，主要是 token 相关，登录、注册）
|     |     |
|     |     └───weixin（微信模块）
|     |
└─────────pipes（管道）
            |
            └───validate-dto.pipe.ts（数据类型自动转换为 dto 定义的类型）
```