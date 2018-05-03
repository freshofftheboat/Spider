// 导入两个必需库
const request = require('sync-request')
const cheerio = require('cheerio')
const fs = require('fs')

class Movie {
    constructor() {
        // 电影名称、评分、简介、排名、封面连接、类型（取第一个关键词）、年份
        this.name = ''
        this.score = 0
        this.introduction = ''
        this.ranking = 0
        this.coverUrl = ''
        this.type = ''
        this.year = ''
    }
}

var log = console.log.bind(console)

var cachedUrl = (url) => {
    var num = url.split('-')[1]
    if (num == undefined) {
        var cacheFile = 'cached_html/' + '1.html'
    } else {
        cacheFile = 'cached_html/' + num
    }
    // 检查缓存文件是否存在
    var exists = fs.existsSync(cacheFile)
    if (exists) {
        var data = fs.readFileSync(cacheFile)
        return data
    } else {
        // 用 GET 方法获取url链接的内容
        var r = request('GET', url)
        // utf-8 网页文件的文本编码
        var body = r.getBody('utf-8')
        // 写入缓存
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

var movieFromItem = (item) => {
    var e = cheerio.load(item)

    var movie = new Movie()
    // 时光网的每部电影都有四个 div：number、mov_pic、mov_con、mov_point
    // 分别对应 排名、海报、内容（标题和简介）和评分
    movie.ranking = e('.number').text()
    movie.coverUrl = e('.mov_pic').find('img').attr('src')
    var content = e('.mov_con')
    movie.name = content.find('h2').text()
    movie.introduction = content.find('.mt3').text()
    movie.score = Number(e('.point').text())
    // movie.score = e('.total').text() + e('.total2').text()
    movie.year = movie.name.slice(-5, -1)
    movie.type = content.find('span').text().slice(2, 4)
    return movie
}

var moviesFromUrl = (url) => {
    // 缓存网页，从文件读取数据
    var body = cachedUrl(url)
    // cheerio.load 把 HTML 解析成可以操作的 DOM
    var e = cheerio.load(body)

    var items = e('#asyncRatingRegion').find('li')
    var movies = []
    for (var i = 0; i < items.length; i++) {
        var item = items[i]
        var m = movieFromItem(item)
        movies.push(m)
    }
    return movies
}

var saveMovie = (movies) => {
    // 生成带有缩进模式的 json 数据，movies 数据为一个数组
    var s = JSON.stringify(movies, null, 2)
    var fs = require('fs')
    var path = 'mtime.txt'
    fs.writeFileSync(path, s)
}

var downloadCovers = (movies) => {
    // 用 request 库下载图片
    var request = require('request')
    for (var i = 0; i < movies.length; i++) {
        var m = movies[i]
        var url = m.coverUrl
        // 图片存储路径
        var path = 'covers/' + m.ranking + '. ' + m.name + '.jpg'
        // 下载并且保存图片（套路）
        // log(typeof(url), typeof(path))
        request(url).pipe(fs.createWriteStream(path))
        // var r = request('GET', url)
        // var img = r.getBody()
        // fs.writeFileSync(path, img)
    }
}

var __main = () => {
    var movies = []
    for (var i = 0; i < 10; i++) {
        var url = 'http://www.mtime.com/top/movie/top100/'
        if (i > 0) {
            url = url + `index-${i + 1}.html`
        }
        var moviesInPage = moviesFromUrl(url)
        // 每一页的电影都是数组，要把 10 个数组拼接起来
        // ES6 语法
        movies = [...movies, ...moviesInPage]
        // // 常规语法
        // movies = movies.concat(moviesInPage)
        
    }
    // log('movies', movies)
    saveMovie(movies)
    downloadCovers(movies)
}

__main()
