export enum HttpStatusCode {
    权限错误 = 210,
    token过期 = 220,
    实体不存在 = 230,
    要注册的用户已经存在 = 240,
    转换出错 = 250,
    参数不足 = 400,
    服务器正忙 = 503,
}

export enum LocalPath {
    novel = "/novel",
    novelSrc = "/novel/src",
    novelHtml = "/novel/html",
    novelPreview = "/novel/preview",
}
