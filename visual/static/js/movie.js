// echarts
const chartStore = {
    bar: null,
    line: null,
}

var log = console.log.bind(console)

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            request.callback(r.response)
        }
    }
    if (request.method == 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

const optionForBar = function(data) {
    const option = {
        title: {
            text: 'Mtime电影 top100 按类型划分',
        },
        xAxis: {
            data: data.axis,
            name: '电影类型',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            name: '电影数量',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data.data
            }
        ]
    }
    return option
}

const optionForType = function(type) {
    const data = {
        axis: [],
        data: [],
    }
    _.each(type, (v, k) => {
        data.axis.push(k)
        data.data.push(v.length)
    })
    const option = optionForBar(data)
    return option
}

const optionForLine = function(data) {
    const option = {
        title: {
            text: 'Mtime top100 平均分数'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0]
                var value = params.value
                var s = value[0] + ': ' + value[1]
                return s
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: '上映时间',
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: '平均分',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            min: 8,
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };
    return option
}

const optionForYear = function(year) {
    const data = _.map(year, (v, k) => {
        const avg = _.meanBy(v, 'score')
        const o = {
            name: k,
            value: [k, avg.toFixed(2)],
        }
        return o
    })
    const option = optionForLine(data)
    return option
}

const renderChart = function(d) {
    const data = d
    const type = _.groupBy(data, 'type')
    const typeOption = optionForType(type)
    const bar = chartStore.bar
    bar.setOption(typeOption)

    const year = _.groupBy(data, 'year')
    const yearOption = optionForYear(year)
    const line = chartStore.line
    line.setOption(yearOption)
}

// const movieJSON = function() {
//     var d = [
//         {
//             "name": "肖申克的救赎 The Shawshank Redemption (1994)",
//             "score": 9.2,
//             "introduction": "1947年，年轻有为的大银行副总裁安迪（蒂姆·罗宾斯 饰）因涉嫌枪杀妻子和与之偷情的高尔夫球教练被判处两个无期徒刑，他将在..",
//             "ranking": "1",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/07/123549.37376649_96X128.jpg",
//             "type": "犯罪",
//             "year": "1994"
//         },
//         {
//             "name": "盗梦空间 Inception (2010)",
//             "score": 9.1,
//             "introduction": "本片被定义为“发生在意识结构内的当代动作科幻片”，诺兰继《黑暗骑士》后再次给我们带来惊喜，带观众游走于梦境与现实之间。",
//             "ranking": "2",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/01/06/105446.89493583_96X128.jpg",
//             "type": "动作",
//             "year": "2010"
//         },
//         {
//             "name": "阿甘正传 Forrest Gump (1994)",
//             "score": 9.1,
//             "introduction": "他是一个占据着成年人躯体的幼童、一个圣贤级的傻子、一个超越真实的普通人、一个代表着民族个性的小人物。",
//             "ranking": "3",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/06/17/145457.44209161_96X128.jpg",
//             "type": "剧情",
//             "year": "1994"
//         },
//         {
//             "name": "辛德勒的名单 Schindler's List (1993)",
//             "score": 9.1,
//             "introduction": "德国投机商人辛德勒为了赚钱，在自己的工厂中使用廉价的犹太人。面对纳粹的屠杀，辛德勒开始想法保护尽可能多的犹太人。",
//             "ranking": "4",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/29/102947.25583478_96X128.jpg",
//             "type": "传记",
//             "year": "1993"
//         },
//         {
//             "name": "教父 The Godfather (1972)",
//             "score": 9.1,
//             "introduction": "1945年夏天，美国本部黑手党科莱昂家族首领，“教父”维托·唐·科莱昂为小女儿康妮举行了盛大的婚礼。“教父”有三个儿子：好..",
//             "ranking": "5",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/23/133539.17727433_96X128.jpg",
//             "type": "犯罪",
//             "year": "1972"
//         },
//         {
//             "name": "海豚湾 The Cove (2009)",
//             "score": 9.1,
//             "introduction": "日本的太地町是一个风光秀丽的美丽海湾，然而每年这里有23000头海豚被日本渔民捕杀。本片对这一残忍的行为进行谴责。",
//             "ranking": "6",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/07/28/145303.88789702_96X128.jpg",
//             "type": "纪录",
//             "year": "2009"
//         },
//         {
//             "name": "机器人总动员 WALL·E (2008)",
//             "score": 9,
//             "introduction": "WALL·E已经在地球上孤独地生活几百年了，他爱上了自己遇见的第一个机器人伊芙，并跟随着她展开了一场充满奇幻的太空之旅。",
//             "ranking": "7",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/20/172527.42989246_96X128.jpg",
//             "type": "剧情",
//             "year": "2008"
//         },
//         {
//             "name": "这个杀手不太冷 Léon (1994)",
//             "score": 9,
//             "introduction": "本片是吕克·贝松在好莱坞执导的第一部作品，非同一般的剧情、人物的精彩演出及出色的配乐使其成为九十年代动作片的经典之作。",
//             "ranking": "8",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/09/12/102734.13658001_96X128.jpg",
//             "type": "犯罪",
//             "year": "1994"
//         },
//         {
//             "name": "霸王别姬 Farewell My Concubine (1993)",
//             "score": 9,
//             "introduction": "影片围绕两个京剧艺人半个世纪的悲欢离合，展现了对传统文化、人的生存状态及人性的思考与领悟。",
//             "ranking": "9",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/12/145818.13256925_96X128.jpg",
//             "type": "爱情",
//             "year": "1993"
//         },
//         {
//             "name": "天堂电影院 Nuovo cinema Paradiso (1988)",
//             "score": 9,
//             "introduction": "本片是为热爱电影的电影工作者、电影观众而精心制作的一部关于电影的礼赞，荣获戛纳影展特别评委奖及奥斯卡最佳外语片奖。",
//             "ranking": "10",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230204.38226096_96X128.jpg",
//             "type": "剧情",
//             "year": "1988"
//         },
//         {
//             "name": "肖申克的救赎 The Shawshank Redemption (1994)",
//             "score": 9.2,
//             "introduction": "1947年，年轻有为的大银行副总裁安迪（蒂姆·罗宾斯 饰）因涉嫌枪杀妻子和与之偷情的高尔夫球教练被判处两个无期徒刑，他将在..",
//             "ranking": "1",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/07/123549.37376649_96X128.jpg",
//             "type": "犯罪",
//             "year": "1994"
//         },
//         {
//             "name": "盗梦空间 Inception (2010)",
//             "score": 9.1,
//             "introduction": "本片被定义为“发生在意识结构内的当代动作科幻片”，诺兰继《黑暗骑士》后再次给我们带来惊喜，带观众游走于梦境与现实之间。",
//             "ranking": "2",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/01/06/105446.89493583_96X128.jpg",
//             "type": "动作",
//             "year": "2010"
//         },
//         {
//             "name": "阿甘正传 Forrest Gump (1994)",
//             "score": 9.1,
//             "introduction": "他是一个占据着成年人躯体的幼童、一个圣贤级的傻子、一个超越真实的普通人、一个代表着民族个性的小人物。",
//             "ranking": "3",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/06/17/145457.44209161_96X128.jpg",
//             "type": "剧情",
//             "year": "1994"
//         },
//         {
//             "name": "辛德勒的名单 Schindler's List (1993)",
//             "score": 9.1,
//             "introduction": "德国投机商人辛德勒为了赚钱，在自己的工厂中使用廉价的犹太人。面对纳粹的屠杀，辛德勒开始想法保护尽可能多的犹太人。",
//             "ranking": "4",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/29/102947.25583478_96X128.jpg",
//             "type": "传记",
//             "year": "1993"
//         },
//         {
//             "name": "教父 The Godfather (1972)",
//             "score": 9.1,
//             "introduction": "1945年夏天，美国本部黑手党科莱昂家族首领，“教父”维托·唐·科莱昂为小女儿康妮举行了盛大的婚礼。“教父”有三个儿子：好..",
//             "ranking": "5",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/23/133539.17727433_96X128.jpg",
//             "type": "犯罪",
//             "year": "1972"
//         },
//         {
//             "name": "海豚湾 The Cove (2009)",
//             "score": 9.1,
//             "introduction": "日本的太地町是一个风光秀丽的美丽海湾，然而每年这里有23000头海豚被日本渔民捕杀。本片对这一残忍的行为进行谴责。",
//             "ranking": "6",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/07/28/145303.88789702_96X128.jpg",
//             "type": "纪录",
//             "year": "2009"
//         },
//         {
//             "name": "机器人总动员 WALL·E (2008)",
//             "score": 9,
//             "introduction": "WALL·E已经在地球上孤独地生活几百年了，他爱上了自己遇见的第一个机器人伊芙，并跟随着她展开了一场充满奇幻的太空之旅。",
//             "ranking": "7",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/20/172527.42989246_96X128.jpg",
//             "type": "剧情",
//             "year": "2008"
//         },
//         {
//             "name": "这个杀手不太冷 Léon (1994)",
//             "score": 9,
//             "introduction": "本片是吕克·贝松在好莱坞执导的第一部作品，非同一般的剧情、人物的精彩演出及出色的配乐使其成为九十年代动作片的经典之作。",
//             "ranking": "8",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/09/12/102734.13658001_96X128.jpg",
//             "type": "犯罪",
//             "year": "1994"
//         },
//         {
//             "name": "霸王别姬 Farewell My Concubine (1993)",
//             "score": 9,
//             "introduction": "影片围绕两个京剧艺人半个世纪的悲欢离合，展现了对传统文化、人的生存状态及人性的思考与领悟。",
//             "ranking": "9",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/12/145818.13256925_96X128.jpg",
//             "type": "爱情",
//             "year": "1993"
//         },
//         {
//             "name": "天堂电影院 Nuovo cinema Paradiso (1988)",
//             "score": 9,
//             "introduction": "本片是为热爱电影的电影工作者、电影观众而精心制作的一部关于电影的礼赞，荣获戛纳影展特别评委奖及奥斯卡最佳外语片奖。",
//             "ranking": "10",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230204.38226096_96X128.jpg",
//             "type": "剧情",
//             "year": "1988"
//         },
//         {
//             "name": "乱世佳人 Gone with the Wind (1939)",
//             "score": 9,
//             "introduction": "在壮丽的时代画卷上演绎出一个极不寻常的爱情故事，开创了以真实而辽阔的历史背景加虚构人物故事的爱情史诗片先河。",
//             "ranking": "11",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/08/145957.19577928_96X128.jpg",
//             "type": "剧情",
//             "year": "1939"
//         },
//         {
//             "name": "寻梦环游记 Coco (2017)",
//             "score": 9,
//             "introduction": "影片讲述一个鞋匠家庭出身的12岁小男孩米格尔，自幼有一个音乐梦，但音乐却是被家庭所禁止的，他们认为自己被音乐诅咒了。在米..",
//             "ranking": "12",
//             "coverUrl": "http://img5.mtime.cn/mt/2017/12/02/172158.15874011_96X128.jpg",
//             "type": "动画",
//             "year": "2017"
//         },
//         {
//             "name": "十二怒汉 12 Angry Men (1957)",
//             "score": 9,
//             "introduction": "这部以陪审团为主角的法庭戏节奏利落，结构紧凑，主题严肃，丝毫不因故事场景的局限性而显得沉闷，而且众多演员均有精彩表演。",
//             "ranking": "13",
//             "coverUrl": "http://img5.mtime.cn/mt/2018/04/10/093745.15273839_96X128.jpg",
//             "type": "剧情",
//             "year": "1957"
//         },
//         {
//             "name": "泰坦尼克号 Titanic (1997)",
//             "score": 8.9,
//             "introduction": "影片以1912年泰坦尼克号邮轮在其处女启航时触礁冰山而沉没的事件为背景，描述了处于不同阶层的两个人——穷画家杰克和贵族女露..",
//             "ranking": "14",
//             "coverUrl": "http://img21.mtime.cn/mt/2012/04/06/101417.97070113_96X128.jpg",
//             "type": "剧情",
//             "year": "1997"
//         },
//         {
//             "name": "搏击俱乐部 Fight Club (1999)",
//             "score": 8.9,
//             "introduction": "这部具强烈芬奇色彩、以死亡为主题的黑色喜剧一反好莱坞商业片模式，映像狂放，手法天马行空，情景怪诞核突，可谓一部视觉杰作。",
//             "ranking": "15",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/10/01/014751.44127701_96X128.jpg",
//             "type": "剧情",
//             "year": "1999"
//         },
//         {
//             "name": "美国往事 Once Upon a Time in America (1984)",
//             "score": 8.9,
//             "introduction": "《美国往事》并不是一部风格明显的类型片，从某种程度上说这是一部纯粹的作者电影，它承载了赛尔乔·莱翁内所有的“美国情结”。",
//             "ranking": "16",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/12/140856.23296398_96X128.jpg",
//             "type": "剧情",
//             "year": "1984"
//         },
//         {
//             "name": "教父2 The Godfather: Part II (1974)",
//             "score": 8.9,
//             "introduction": "本片既是第一集的前传，也是续集。一方面，年轻的维托展现出前辈教父的创业史，另一方面，迈克作为新一代将黑手党家族现代化。",
//             "ranking": "17",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/07/22/095736.99846727_96X128.jpg",
//             "type": "惊悚",
//             "year": "1974"
//         },
//         {
//             "name": "海洋 Océans (2009)",
//             "score": 8.9,
//             "introduction": "法国导演雅克·贝汉与雅克·克鲁佐德深入探索这个覆盖着地球表面的四分之三的“蓝色领土”，完整地呈现海洋的壮美辽阔。",
//             "ranking": "18",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/09/07/171052.22583695_96X128.jpg",
//             "type": "纪录",
//             "year": "2009"
//         },
//         {
//             "name": "七武士 The Seven Samurai (1954)",
//             "score": 8.9,
//             "introduction": "黑泽明第一部真正加入西片趣味的时代剧，描写日本战国时代，贫穷百姓为保卫家园，与雇来的七位武士联手击退强盗的故事。",
//             "ranking": "19",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/04/25/203141.15149920_96X128.jpg",
//             "type": "动作",
//             "year": "1954"
//         },
//         {
//             "name": "阿凡达 Avatar (2009)",
//             "score": 8.8,
//             "introduction": "在未来世界，人类为取得潘多拉星球的资源，开启了阿凡达计划。前海军队员杰克奉命出发，然而这最终是一段探索与救赎的旅程。",
//             "ranking": "20",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/09/01/221449.48366966_96X128.jpg",
//             "type": "动作",
//             "year": "2009"
//         },
//         {
//             "name": "乱世佳人 Gone with the Wind (1939)",
//             "score": 9,
//             "introduction": "在壮丽的时代画卷上演绎出一个极不寻常的爱情故事，开创了以真实而辽阔的历史背景加虚构人物故事的爱情史诗片先河。",
//             "ranking": "11",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/08/145957.19577928_96X128.jpg",
//             "type": "剧情",
//             "year": "1939"
//         },
//         {
//             "name": "寻梦环游记 Coco (2017)",
//             "score": 9,
//             "introduction": "影片讲述一个鞋匠家庭出身的12岁小男孩米格尔，自幼有一个音乐梦，但音乐却是被家庭所禁止的，他们认为自己被音乐诅咒了。在米..",
//             "ranking": "12",
//             "coverUrl": "http://img5.mtime.cn/mt/2017/12/02/172158.15874011_96X128.jpg",
//             "type": "动画",
//             "year": "2017"
//         },
//         {
//             "name": "十二怒汉 12 Angry Men (1957)",
//             "score": 9,
//             "introduction": "这部以陪审团为主角的法庭戏节奏利落，结构紧凑，主题严肃，丝毫不因故事场景的局限性而显得沉闷，而且众多演员均有精彩表演。",
//             "ranking": "13",
//             "coverUrl": "http://img5.mtime.cn/mt/2018/04/10/093745.15273839_96X128.jpg",
//             "type": "剧情",
//             "year": "1957"
//         },
//         {
//             "name": "泰坦尼克号 Titanic (1997)",
//             "score": 8.9,
//             "introduction": "影片以1912年泰坦尼克号邮轮在其处女启航时触礁冰山而沉没的事件为背景，描述了处于不同阶层的两个人——穷画家杰克和贵族女露..",
//             "ranking": "14",
//             "coverUrl": "http://img21.mtime.cn/mt/2012/04/06/101417.97070113_96X128.jpg",
//             "type": "剧情",
//             "year": "1997"
//         },
//         {
//             "name": "搏击俱乐部 Fight Club (1999)",
//             "score": 8.9,
//             "introduction": "这部具强烈芬奇色彩、以死亡为主题的黑色喜剧一反好莱坞商业片模式，映像狂放，手法天马行空，情景怪诞核突，可谓一部视觉杰作。",
//             "ranking": "15",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/10/01/014751.44127701_96X128.jpg",
//             "type": "剧情",
//             "year": "1999"
//         },
//         {
//             "name": "美国往事 Once Upon a Time in America (1984)",
//             "score": 8.9,
//             "introduction": "《美国往事》并不是一部风格明显的类型片，从某种程度上说这是一部纯粹的作者电影，它承载了赛尔乔·莱翁内所有的“美国情结”。",
//             "ranking": "16",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/12/140856.23296398_96X128.jpg",
//             "type": "剧情",
//             "year": "1984"
//         },
//         {
//             "name": "教父2 The Godfather: Part II (1974)",
//             "score": 8.9,
//             "introduction": "本片既是第一集的前传，也是续集。一方面，年轻的维托展现出前辈教父的创业史，另一方面，迈克作为新一代将黑手党家族现代化。",
//             "ranking": "17",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/07/22/095736.99846727_96X128.jpg",
//             "type": "惊悚",
//             "year": "1974"
//         },
//         {
//             "name": "海洋 Océans (2009)",
//             "score": 8.9,
//             "introduction": "法国导演雅克·贝汉与雅克·克鲁佐德深入探索这个覆盖着地球表面的四分之三的“蓝色领土”，完整地呈现海洋的壮美辽阔。",
//             "ranking": "18",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/09/07/171052.22583695_96X128.jpg",
//             "type": "纪录",
//             "year": "2009"
//         },
//         {
//             "name": "七武士 The Seven Samurai (1954)",
//             "score": 8.9,
//             "introduction": "黑泽明第一部真正加入西片趣味的时代剧，描写日本战国时代，贫穷百姓为保卫家园，与雇来的七位武士联手击退强盗的故事。",
//             "ranking": "19",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/04/25/203141.15149920_96X128.jpg",
//             "type": "动作",
//             "year": "1954"
//         },
//         {
//             "name": "阿凡达 Avatar (2009)",
//             "score": 8.8,
//             "introduction": "在未来世界，人类为取得潘多拉星球的资源，开启了阿凡达计划。前海军队员杰克奉命出发，然而这最终是一段探索与救赎的旅程。",
//             "ranking": "20",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/09/01/221449.48366966_96X128.jpg",
//             "type": "动作",
//             "year": "2009"
//         },
//         {
//             "name": "海上钢琴师 The Legend of 1900 (1998)",
//             "score": 8.8,
//             "introduction": "一名具有钢琴天赋的孤儿历经一切的苦难：音乐、爱情及两次大战，但他从未放弃过他生长的地方。一部荡气回肠的诗意旅程电影。",
//             "ranking": "21",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224651.16676731_96X128.jpg",
//             "type": "剧情",
//             "year": "1998"
//         },
//         {
//             "name": "三傻大闹宝莱坞 Three Idiots (2009)",
//             "score": 8.8,
//             "introduction": "兰乔对大学填鸭式的教育十分不满，在他的引导下，其他两个朋友也对自己的人生有了新的规划，然而毕业后，兰乔选择了消失……",
//             "ranking": "22",
//             "coverUrl": "http://img21.mtime.cn/mt/2011/11/11/142149.70599382_96X128.jpg",
//             "type": "冒险",
//             "year": "2009"
//         },
//         {
//             "name": "蝙蝠侠：黑暗骑士崛起 The Dark Knight Rises (2012)",
//             "score": 8.8,
//             "introduction": "本片为导演诺兰一手打造的“新蝙蝠侠三部曲”最终章，蝙蝠侠将遇到神秘的猫女以及戴面具的恐怖分子贝恩…",
//             "ranking": "23",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/12/09/150026.89144122_96X128.jpg",
//             "type": "动作",
//             "year": "2012"
//         },
//         {
//             "name": "星际穿越 Interstellar (2014)",
//             "score": 8.8,
//             "introduction": "影片发生在不远的未来，地球气候已经不适合粮食生长，水资源枯竭，饥荒肆掠，人类面临着灭绝的威胁。这时科学家们发现了一个神..",
//             "ranking": "24",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/10/17/094153.86737039_96X128.jpg",
//             "type": "冒险",
//             "year": "2014"
//         },
//         {
//             "name": "少年派的奇幻漂流 Life of Pi (2012)",
//             "score": 8.8,
//             "introduction": "印度少年派出海后遭遇灾难，身边只有一艘救生艇跟一只凶猛的孟加拉虎。派有可能度过这场灾难吗？他要如何和这只老虎共处呢？",
//             "ranking": "25",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/01/09/164644.22953541_96X128.jpg",
//             "type": "冒险",
//             "year": "2012"
//         },
//         {
//             "name": "玛丽和马克思 Mary and Max (2009)",
//             "score": 8.8,
//             "introduction": "影片讲述了一个发生在两位笔友之间的非常简单的故事。玛丽·丁克尔（托妮·科莱特 配音）是一个居住在墨尔本市区的胖乎乎的有..",
//             "ranking": "26",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/064812.38936535_96X128.jpg",
//             "type": "动画",
//             "year": "2009"
//         },
//         {
//             "name": "忠犬八公的故事 Hachiko: A Dog's Story (2009)",
//             "score": 8.8,
//             "introduction": "故事讲述一位大学教授（理查·基尔饰）收养了一只小秋田犬，取名“八公”。之后的每天，八公早上将教授送到车站，傍晚等待教授..",
//             "ranking": "27",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/060511.92518039_96X128.jpg",
//             "type": "剧情",
//             "year": "2009"
//         },
//         {
//             "name": "迈克尔·杰克逊：就是这样 This Is It (2009)",
//             "score": 8.8,
//             "introduction": "这是一部纪录迈克尔·杰克逊在生前准备告别演唱会的影片，完整呈现他对演唱会每个环节事必躬亲参与并提供创意的各个细节。",
//             "ranking": "28",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/075434.20623674_96X128.jpg",
//             "type": "纪录",
//             "year": "2009"
//         },
//         {
//             "name": "暴力云与送子鹳 Partly Cloudy (2009)",
//             "score": 8.8,
//             "introduction": "高高的天空中有一群云朵，他们像女娲一样捏出一个个小婴儿，让送子鹳带入千家万户。而他们之中有一朵忧伤的“阴云”Gus，他总..",
//             "ranking": "29",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/073659.56693087_96X128.jpg",
//             "type": "动画",
//             "year": "2009"
//         },
//         {
//             "name": "蝙蝠侠：黑暗骑士 The Dark Knight (2008)",
//             "score": 8.7,
//             "introduction": "继续以拯救生命、打击犯罪为己任的“蝙蝠侠”，遭遇到了最具威胁性的对手“小丑”，一个喜欢将自己的脸上涂满了油彩的犯罪专家。",
//             "ranking": "30",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/035905.95742424_96X128.jpg",
//             "type": "动作",
//             "year": "2008"
//         },
//         {
//             "name": "海上钢琴师 The Legend of 1900 (1998)",
//             "score": 8.8,
//             "introduction": "一名具有钢琴天赋的孤儿历经一切的苦难：音乐、爱情及两次大战，但他从未放弃过他生长的地方。一部荡气回肠的诗意旅程电影。",
//             "ranking": "21",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224651.16676731_96X128.jpg",
//             "type": "剧情",
//             "year": "1998"
//         },
//         {
//             "name": "三傻大闹宝莱坞 Three Idiots (2009)",
//             "score": 8.8,
//             "introduction": "兰乔对大学填鸭式的教育十分不满，在他的引导下，其他两个朋友也对自己的人生有了新的规划，然而毕业后，兰乔选择了消失……",
//             "ranking": "22",
//             "coverUrl": "http://img21.mtime.cn/mt/2011/11/11/142149.70599382_96X128.jpg",
//             "type": "冒险",
//             "year": "2009"
//         },
//         {
//             "name": "蝙蝠侠：黑暗骑士崛起 The Dark Knight Rises (2012)",
//             "score": 8.8,
//             "introduction": "本片为导演诺兰一手打造的“新蝙蝠侠三部曲”最终章，蝙蝠侠将遇到神秘的猫女以及戴面具的恐怖分子贝恩…",
//             "ranking": "23",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/12/09/150026.89144122_96X128.jpg",
//             "type": "动作",
//             "year": "2012"
//         },
//         {
//             "name": "星际穿越 Interstellar (2014)",
//             "score": 8.8,
//             "introduction": "影片发生在不远的未来，地球气候已经不适合粮食生长，水资源枯竭，饥荒肆掠，人类面临着灭绝的威胁。这时科学家们发现了一个神..",
//             "ranking": "24",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/10/17/094153.86737039_96X128.jpg",
//             "type": "冒险",
//             "year": "2014"
//         },
//         {
//             "name": "少年派的奇幻漂流 Life of Pi (2012)",
//             "score": 8.8,
//             "introduction": "印度少年派出海后遭遇灾难，身边只有一艘救生艇跟一只凶猛的孟加拉虎。派有可能度过这场灾难吗？他要如何和这只老虎共处呢？",
//             "ranking": "25",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/01/09/164644.22953541_96X128.jpg",
//             "type": "冒险",
//             "year": "2012"
//         },
//         {
//             "name": "玛丽和马克思 Mary and Max (2009)",
//             "score": 8.8,
//             "introduction": "影片讲述了一个发生在两位笔友之间的非常简单的故事。玛丽·丁克尔（托妮·科莱特 配音）是一个居住在墨尔本市区的胖乎乎的有..",
//             "ranking": "26",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/064812.38936535_96X128.jpg",
//             "type": "动画",
//             "year": "2009"
//         },
//         {
//             "name": "忠犬八公的故事 Hachiko: A Dog's Story (2009)",
//             "score": 8.8,
//             "introduction": "故事讲述一位大学教授（理查·基尔饰）收养了一只小秋田犬，取名“八公”。之后的每天，八公早上将教授送到车站，傍晚等待教授..",
//             "ranking": "27",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/060511.92518039_96X128.jpg",
//             "type": "剧情",
//             "year": "2009"
//         },
//         {
//             "name": "迈克尔·杰克逊：就是这样 This Is It (2009)",
//             "score": 8.8,
//             "introduction": "这是一部纪录迈克尔·杰克逊在生前准备告别演唱会的影片，完整呈现他对演唱会每个环节事必躬亲参与并提供创意的各个细节。",
//             "ranking": "28",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/075434.20623674_96X128.jpg",
//             "type": "纪录",
//             "year": "2009"
//         },
//         {
//             "name": "暴力云与送子鹳 Partly Cloudy (2009)",
//             "score": 8.8,
//             "introduction": "高高的天空中有一群云朵，他们像女娲一样捏出一个个小婴儿，让送子鹳带入千家万户。而他们之中有一朵忧伤的“阴云”Gus，他总..",
//             "ranking": "29",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/073659.56693087_96X128.jpg",
//             "type": "动画",
//             "year": "2009"
//         },
//         {
//             "name": "蝙蝠侠：黑暗骑士 The Dark Knight (2008)",
//             "score": 8.7,
//             "introduction": "继续以拯救生命、打击犯罪为己任的“蝙蝠侠”，遭遇到了最具威胁性的对手“小丑”，一个喜欢将自己的脸上涂满了油彩的犯罪专家。",
//             "ranking": "30",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/035905.95742424_96X128.jpg",
//             "type": "动作",
//             "year": "2008"
//         },
//         {
//             "name": "魔戒首部曲：魔戒现身 The Lord of the Rings: The Fellowship of the Ring (2001)",
//             "score": 8.7,
//             "introduction": "本片背景为神秘的史前时代，是一场正邪较量引发的长篇故事，而拯救世界的危险任务则落在年轻的哈比族人弗罗多·巴金斯的身上。",
//             "ranking": "31",
//             "coverUrl": "http://img5.mtime.cn/mt/2016/12/30/160932.10422493_96X128.jpg",
//             "type": "冒险",
//             "year": "2001"
//         },
//         {
//             "name": "放牛班的春天 Les Choristes (2004)",
//             "score": 8.7,
//             "introduction": "世界著名指挥家皮埃尔·莫安琦(雅克·贝汉 饰)重回法国故地出席母亲的葬礼，他的旧友(戴迪亚·费拉蒙 饰)送给他一本陈旧的日记..",
//             "ranking": "32",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/14/150514.22371181_96X128.jpg",
//             "type": "剧情",
//             "year": "2004"
//         },
//         {
//             "name": "闻香识女人 Scent of a Woman (1992)",
//             "score": 8.7,
//             "introduction": "一次意外的邂逅、一段性感的探戈、一出恣意的飙车和一段酣畅淋漓的演讲为我们完整地勾勒出生命从毁灭到重生的全部过程。",
//             "ranking": "33",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/232355.13095445_96X128.jpg",
//             "type": "剧情",
//             "year": "1992"
//         },
//         {
//             "name": "狮子王 The Lion King (1994)",
//             "score": 8.7,
//             "introduction": "小狮子王辛巴在众多热情的朋友的陪伴下，不但经历了生命中最光荣的时刻，也遭遇了最艰难的挑战，最后终于成为了森林之王。",
//             "ranking": "34",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/15/165203.17697083_96X128.jpg",
//             "type": "动画",
//             "year": "1994"
//         },
//         {
//             "name": "龙猫 My Neighbor Totoro (1988)",
//             "score": 8.7,
//             "introduction": "小学生小月和四岁的妹妹小梅，在妈妈住院期间，跟着爸爸搬到郊外的一间被人戏称为「鬼屋」的旧屋里住，在那里他们发现了龙猫。",
//             "ranking": "35",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225216.89630284_96X128.jpg",
//             "type": "动画",
//             "year": "1988"
//         },
//         {
//             "name": "罗马假日 Roman Holiday (1953)",
//             "score": 8.7,
//             "introduction": "皇室公主安妮访问罗马时私自出游，与美国记者乔邂逅。乔起先是为了偷拍公主，最终却爱上了她。安妮起先厌倦皇室繁文缛节，但经..",
//             "ranking": "36",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/12/143918.49241382_96X128.jpg",
//             "type": "喜剧",
//             "year": "1953"
//         },
//         {
//             "name": "天空之城 Laputa: Castle in the Sky (1986)",
//             "score": 8.7,
//             "introduction": "拉比达是一座飘在空中的岛，一个以科学力量支配一切的古老帝国。在古老传说中，拉比达已无人居住，蕴藏着无限财富。",
//             "ranking": "37",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230130.33587497_96X128.jpg",
//             "type": "奇幻",
//             "year": "1986"
//         },
//         {
//             "name": "飞越疯人院 One Flew Over the Cuckoo's Nest (1975)",
//             "score": 8.7,
//             "introduction": "本片带有强烈的阶级观，通过讽喻和警世的象征，辛辣地讽刺现实社会中的消极现象。导演在演员的选择和处理上具有特殊的才能。",
//             "ranking": "38",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224450.49138883_96X128.jpg",
//             "type": "剧情",
//             "year": "1975"
//         },
//         {
//             "name": "鬼子来了 Devils on the Doorstep (2000)",
//             "score": 8.7,
//             "introduction": "取材于小说《生存》，提炼了“农民愚昧”和“战争荒诞”的一面，笔锋直指国人弱点，将更多忧患意识注入影像化的故事中。",
//             "ranking": "39",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224614.64675869_96X128.jpg",
//             "type": "剧情",
//             "year": "2000"
//         },
//         {
//             "name": "音乐之声 The Sound of Music (1965)",
//             "score": 8.7,
//             "introduction": "1938年奥地利萨尔兹堡，年轻活泼的修女玛丽亚到退役海军上校冯·特拉普家，照顾他的七个孩子。冯·特拉普上校虽然冷漠严厉，但..",
//             "ranking": "40",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/231733.17933675_96X128.jpg",
//             "type": "传记",
//             "year": "1965"
//         },
//         {
//             "name": "魔戒首部曲：魔戒现身 The Lord of the Rings: The Fellowship of the Ring (2001)",
//             "score": 8.7,
//             "introduction": "本片背景为神秘的史前时代，是一场正邪较量引发的长篇故事，而拯救世界的危险任务则落在年轻的哈比族人弗罗多·巴金斯的身上。",
//             "ranking": "31",
//             "coverUrl": "http://img5.mtime.cn/mt/2016/12/30/160932.10422493_96X128.jpg",
//             "type": "冒险",
//             "year": "2001"
//         },
//         {
//             "name": "放牛班的春天 Les Choristes (2004)",
//             "score": 8.7,
//             "introduction": "世界著名指挥家皮埃尔·莫安琦(雅克·贝汉 饰)重回法国故地出席母亲的葬礼，他的旧友(戴迪亚·费拉蒙 饰)送给他一本陈旧的日记..",
//             "ranking": "32",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/14/150514.22371181_96X128.jpg",
//             "type": "剧情",
//             "year": "2004"
//         },
//         {
//             "name": "闻香识女人 Scent of a Woman (1992)",
//             "score": 8.7,
//             "introduction": "一次意外的邂逅、一段性感的探戈、一出恣意的飙车和一段酣畅淋漓的演讲为我们完整地勾勒出生命从毁灭到重生的全部过程。",
//             "ranking": "33",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/232355.13095445_96X128.jpg",
//             "type": "剧情",
//             "year": "1992"
//         },
//         {
//             "name": "狮子王 The Lion King (1994)",
//             "score": 8.7,
//             "introduction": "小狮子王辛巴在众多热情的朋友的陪伴下，不但经历了生命中最光荣的时刻，也遭遇了最艰难的挑战，最后终于成为了森林之王。",
//             "ranking": "34",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/15/165203.17697083_96X128.jpg",
//             "type": "动画",
//             "year": "1994"
//         },
//         {
//             "name": "龙猫 My Neighbor Totoro (1988)",
//             "score": 8.7,
//             "introduction": "小学生小月和四岁的妹妹小梅，在妈妈住院期间，跟着爸爸搬到郊外的一间被人戏称为「鬼屋」的旧屋里住，在那里他们发现了龙猫。",
//             "ranking": "35",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225216.89630284_96X128.jpg",
//             "type": "动画",
//             "year": "1988"
//         },
//         {
//             "name": "罗马假日 Roman Holiday (1953)",
//             "score": 8.7,
//             "introduction": "皇室公主安妮访问罗马时私自出游，与美国记者乔邂逅。乔起先是为了偷拍公主，最终却爱上了她。安妮起先厌倦皇室繁文缛节，但经..",
//             "ranking": "36",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/12/143918.49241382_96X128.jpg",
//             "type": "喜剧",
//             "year": "1953"
//         },
//         {
//             "name": "天空之城 Laputa: Castle in the Sky (1986)",
//             "score": 8.7,
//             "introduction": "拉比达是一座飘在空中的岛，一个以科学力量支配一切的古老帝国。在古老传说中，拉比达已无人居住，蕴藏着无限财富。",
//             "ranking": "37",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230130.33587497_96X128.jpg",
//             "type": "奇幻",
//             "year": "1986"
//         },
//         {
//             "name": "飞越疯人院 One Flew Over the Cuckoo's Nest (1975)",
//             "score": 8.7,
//             "introduction": "本片带有强烈的阶级观，通过讽喻和警世的象征，辛辣地讽刺现实社会中的消极现象。导演在演员的选择和处理上具有特殊的才能。",
//             "ranking": "38",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224450.49138883_96X128.jpg",
//             "type": "剧情",
//             "year": "1975"
//         },
//         {
//             "name": "鬼子来了 Devils on the Doorstep (2000)",
//             "score": 8.7,
//             "introduction": "取材于小说《生存》，提炼了“农民愚昧”和“战争荒诞”的一面，笔锋直指国人弱点，将更多忧患意识注入影像化的故事中。",
//             "ranking": "39",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224614.64675869_96X128.jpg",
//             "type": "剧情",
//             "year": "2000"
//         },
//         {
//             "name": "音乐之声 The Sound of Music (1965)",
//             "score": 8.7,
//             "introduction": "1938年奥地利萨尔兹堡，年轻活泼的修女玛丽亚到退役海军上校冯·特拉普家，照顾他的七个孩子。冯·特拉普上校虽然冷漠严厉，但..",
//             "ranking": "40",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/231733.17933675_96X128.jpg",
//             "type": "传记",
//             "year": "1965"
//         },
//         {
//             "name": "一一 Yi yi: A One and a Two (2000)",
//             "score": 8.7,
//             "introduction": "将近三个小时的影像细腻而漫长，其间没有大起大落，只是一直温和的诉说，讲述那些我们日夜重复的事情。",
//             "ranking": "41",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/04/173625.19714267_96X128.jpg",
//             "type": "剧情",
//             "year": "2000"
//         },
//         {
//             "name": "完美的世界 A Perfect World (1993)",
//             "score": 8.7,
//             "introduction": "影片聚焦于逃脱于社会秩序之外的主人翁是如何在法律和道德的边缘建立起自己的“完美的世界”的，主题则是人生、自由和信仰。",
//             "ranking": "42",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/30/180041.39877079_96X128.jpg",
//             "type": "犯罪",
//             "year": "1993"
//         },
//         {
//             "name": "飞屋环游记 Up (2009)",
//             "score": 8.6,
//             "introduction": "一个名叫卡尔的老人，一生都梦想着能环游世界。在他生命的最后阶段，仿佛在命运的安排下，与8岁的罗素一同踏上了冒险的旅程。",
//             "ranking": "43",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/16/170353.61991681_96X128.jpg",
//             "type": "动画",
//             "year": "2009"
//         },
//         {
//             "name": "天使爱美丽 Amelie (2001)",
//             "score": 8.6,
//             "introduction": "一个现代灰姑娘的童话，镜头底下的巴黎是比明信片更加明媚的世外桃源，把少女的悸动和憧憬化成一幕幕迷人的画卷。",
//             "ranking": "44",
//             "coverUrl": "http://img21.mtime.cn/mt/2012/02/14/111655.86253293_96X128.jpg",
//             "type": "喜剧",
//             "year": "2001"
//         },
//         {
//             "name": "魔戒二部曲：双塔奇兵 The Lord of the Rings: The Two Towers (2002)",
//             "score": 8.6,
//             "introduction": "霍比特人弗罗多和他的朋友山姆，继续前往魔多山要完成摧毁魔戒的任务，一场魔戒圣战即将展开……",
//             "ranking": "45",
//             "coverUrl": "http://img5.mtime.cn/mt/2016/12/30/161051.34765047_96X128.jpg",
//             "type": "冒险",
//             "year": "2002"
//         },
//         {
//             "name": "低俗小说 Pulp Fiction (1994)",
//             "score": 8.6,
//             "introduction": "《低俗小说》由“文森特和马沙的妻子”、“金表”、“邦妮的处境”三个故事以及影片首尾的序幕和尾声五个部分组成。　　盗贼“..",
//             "ranking": "46",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224328.35081501_96X128.jpg",
//             "type": "犯罪",
//             "year": "1994"
//         },
//         {
//             "name": "玩具总动员3 Toy Story 3 (2010)",
//             "score": 8.6,
//             "introduction": "小男孩安弟长大成人，准备离家前往大学，他妈妈错把玩具送到幼儿园。玩具们惨遭蹂躏，于是它们决定展开一个伟大的逃跑计划。",
//             "ranking": "47",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/09/02/155737.19712583_96X128.jpg",
//             "type": "动画",
//             "year": "2010"
//         },
//         {
//             "name": "怦然心动 Flipped (2010)",
//             "score": 8.6,
//             "introduction": "女孩朱莉小时候就喜欢男孩布莱斯，不过布莱斯并不喜欢她。随着年龄的增长，布莱斯觉得朱莉很有魅力，朱莉反而觉得他很空洞……",
//             "ranking": "48",
//             "coverUrl": "http://img21.mtime.cn/mt/2011/01/02/002740.33762853_96X128.jpg",
//             "type": "爱情",
//             "year": "2010"
//         },
//         {
//             "name": "情书 Love Letter (1995)",
//             "score": 8.6,
//             "introduction": "一封寄往天国的情书，开启了两段刻骨铭心的爱情……",
//             "ranking": "49",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225708.86734425_96X128.jpg",
//             "type": "剧情",
//             "year": "1995"
//         },
//         {
//             "name": "疯狂动物城 Zootopia (2016)",
//             "score": 0,
//             "introduction": "影片故事发生在欣欣向荣的动物乌托邦，在这里各种动物和平共处。尼克·王尔德是只说话速度特别溜、有着宏图伟愿的狐狸，然而他..",
//             "ranking": "50",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/01/28/092552.17985926_96X128.jpg",
//             "type": "动画",
//             "year": "2016"
//         },
//         {
//             "name": "一一 Yi yi: A One and a Two (2000)",
//             "score": 8.7,
//             "introduction": "将近三个小时的影像细腻而漫长，其间没有大起大落，只是一直温和的诉说，讲述那些我们日夜重复的事情。",
//             "ranking": "41",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/04/173625.19714267_96X128.jpg",
//             "type": "剧情",
//             "year": "2000"
//         },
//         {
//             "name": "完美的世界 A Perfect World (1993)",
//             "score": 8.7,
//             "introduction": "影片聚焦于逃脱于社会秩序之外的主人翁是如何在法律和道德的边缘建立起自己的“完美的世界”的，主题则是人生、自由和信仰。",
//             "ranking": "42",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/30/180041.39877079_96X128.jpg",
//             "type": "犯罪",
//             "year": "1993"
//         },
//         {
//             "name": "飞屋环游记 Up (2009)",
//             "score": 8.6,
//             "introduction": "一个名叫卡尔的老人，一生都梦想着能环游世界。在他生命的最后阶段，仿佛在命运的安排下，与8岁的罗素一同踏上了冒险的旅程。",
//             "ranking": "43",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/16/170353.61991681_96X128.jpg",
//             "type": "动画",
//             "year": "2009"
//         },
//         {
//             "name": "天使爱美丽 Amelie (2001)",
//             "score": 8.6,
//             "introduction": "一个现代灰姑娘的童话，镜头底下的巴黎是比明信片更加明媚的世外桃源，把少女的悸动和憧憬化成一幕幕迷人的画卷。",
//             "ranking": "44",
//             "coverUrl": "http://img21.mtime.cn/mt/2012/02/14/111655.86253293_96X128.jpg",
//             "type": "喜剧",
//             "year": "2001"
//         },
//         {
//             "name": "魔戒二部曲：双塔奇兵 The Lord of the Rings: The Two Towers (2002)",
//             "score": 8.6,
//             "introduction": "霍比特人弗罗多和他的朋友山姆，继续前往魔多山要完成摧毁魔戒的任务，一场魔戒圣战即将展开……",
//             "ranking": "45",
//             "coverUrl": "http://img5.mtime.cn/mt/2016/12/30/161051.34765047_96X128.jpg",
//             "type": "冒险",
//             "year": "2002"
//         },
//         {
//             "name": "低俗小说 Pulp Fiction (1994)",
//             "score": 8.6,
//             "introduction": "《低俗小说》由“文森特和马沙的妻子”、“金表”、“邦妮的处境”三个故事以及影片首尾的序幕和尾声五个部分组成。　　盗贼“..",
//             "ranking": "46",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224328.35081501_96X128.jpg",
//             "type": "犯罪",
//             "year": "1994"
//         },
//         {
//             "name": "玩具总动员3 Toy Story 3 (2010)",
//             "score": 8.6,
//             "introduction": "小男孩安弟长大成人，准备离家前往大学，他妈妈错把玩具送到幼儿园。玩具们惨遭蹂躏，于是它们决定展开一个伟大的逃跑计划。",
//             "ranking": "47",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/09/02/155737.19712583_96X128.jpg",
//             "type": "动画",
//             "year": "2010"
//         },
//         {
//             "name": "怦然心动 Flipped (2010)",
//             "score": 8.6,
//             "introduction": "女孩朱莉小时候就喜欢男孩布莱斯，不过布莱斯并不喜欢她。随着年龄的增长，布莱斯觉得朱莉很有魅力，朱莉反而觉得他很空洞……",
//             "ranking": "48",
//             "coverUrl": "http://img21.mtime.cn/mt/2011/01/02/002740.33762853_96X128.jpg",
//             "type": "爱情",
//             "year": "2010"
//         },
//         {
//             "name": "情书 Love Letter (1995)",
//             "score": 8.6,
//             "introduction": "一封寄往天国的情书，开启了两段刻骨铭心的爱情……",
//             "ranking": "49",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225708.86734425_96X128.jpg",
//             "type": "剧情",
//             "year": "1995"
//         },
//         {
//             "name": "疯狂动物城 Zootopia (2016)",
//             "score": 0,
//             "introduction": "影片故事发生在欣欣向荣的动物乌托邦，在这里各种动物和平共处。尼克·王尔德是只说话速度特别溜、有着宏图伟愿的狐狸，然而他..",
//             "ranking": "50",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/01/28/092552.17985926_96X128.jpg",
//             "type": "动画",
//             "year": "2016"
//         },
//         {
//             "name": "钢琴家 The Pianist (2002)",
//             "score": 8.6,
//             "introduction": "本片导演手法扎实但不炫耀，布洛迪的表演是全片最大的亮点。导演和男主角均获奥斯卡奖。影片本身获戛纳金棕榈奖。",
//             "ranking": "51",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/09/06/110952.46685238_96X128.jpg",
//             "type": "传记",
//             "year": "2002"
//         },
//         {
//             "name": "两杆大烟枪 Lock, Stock and Two Smoking Barrels (1998)",
//             "score": 8.6,
//             "introduction": "贝肯、汤姆、梭柏和艾迪四人欠上了帮派老大亨利一笔巨款，逾期一天就剁掉一只手指。他们会采取什么不法的手段来偿还这笔钱呢？",
//             "ranking": "52",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/232203.15587159_96X128.jpg",
//             "type": "喜剧",
//             "year": "1998"
//         },
//         {
//             "name": "死亡诗社 Dead Poets Society (1989)",
//             "score": 8.6,
//             "introduction": "一群受传统教育的学生和一位反传统教育的老师之间有什么是值得深思？学生们在无助的情况下所做的决定又是什么？《死亡诗社》回..",
//             "ranking": "53",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/19/114247.24944099_96X128.jpg",
//             "type": "喜剧",
//             "year": "1989"
//         },
//         {
//             "name": "活着 To Live (1994)",
//             "score": 8.6,
//             "introduction": "影片露出一股悲悯情怀和伤感的黑色幽默，它将历史浓缩为个人命运，而命如蝼蚁般的个人命运，只能是枉自兴叹的生命之痛。",
//             "ranking": "54",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/06/30/093845.87930039_96X128.jpg",
//             "type": "剧情",
//             "year": "1994"
//         },
//         {
//             "name": "幽灵公主 Princess Mononoke (1997)",
//             "score": 8.6,
//             "introduction": "《幽灵公主》主题是人与自然的关系，描述了人类为了发展技术力量不断破坏自然，从而受到自然的报复为之付出代价的故事。",
//             "ranking": "55",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230741.66801332_96X128.jpg",
//             "type": "动画",
//             "year": "1997"
//         },
//         {
//             "name": "杀人回忆 Memories of Murder (2003)",
//             "score": 8.6,
//             "introduction": "影片改编自韩国“三大未解悬案”之一的“雨夜连环强奸杀人案”，拍摄手法娴熟，张弛有度，确立了奉俊昊导演的个人表现风格。",
//             "ranking": "56",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225455.29950217_96X128.jpg",
//             "type": "犯罪",
//             "year": "2003"
//         },
//         {
//             "name": "无法触碰 Intouchables (2011)",
//             "score": 8.6,
//             "introduction": "本片是2011年法国影坛的最大黑马，上映四周观影人次超过1千8百万，成为年度票房冠军，并获东京电影节最佳影片奖。",
//             "ranking": "57",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/05/08/112850.71599127_96X128.jpg",
//             "type": "传记",
//             "year": "2011"
//         },
//         {
//             "name": "梦之安魂曲 Requiem for a Dream (2000)",
//             "score": 8.6,
//             "introduction": "通过一对母子各自的“瘾”，表现了生活中存在的形形色色的不良追求。导演达伦·阿罗诺夫斯以其大胆探索的表现方式闻名，本片令..",
//             "ranking": "58",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/234526.98936381_96X128.jpg",
//             "type": "剧情",
//             "year": "2000"
//         },
//         {
//             "name": "被嫌弃的松子的一生 Memories of Matsuko (2006)",
//             "score": 8.6,
//             "introduction": "悲剧性、戏剧性、寓言性和实在性多种元素，在中岛哲也的影像世界中融为一体，这是一个名叫松子的女人看似不幸的幸福故事。",
//             "ranking": "59",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/033724.51239358_96X128.jpg",
//             "type": "爱情",
//             "year": "2006"
//         },
//         {
//             "name": "一次别离 A Separation (2011)",
//             "score": 8.6,
//             "introduction": "导演阿斯哈·法哈蒂用他冷静、客观又充满关切的镜头风格，展现了当代伊朗人在亲情和宗教生活方面的纠结，影射批判了伊朗等级分..",
//             "ranking": "60",
//             "coverUrl": "http://img31.mtime.cn/mt/2012/10/26/100020.67786006_96X128.jpg",
//             "type": "剧情",
//             "year": "2011"
//         },
//         {
//             "name": "钢琴家 The Pianist (2002)",
//             "score": 8.6,
//             "introduction": "本片导演手法扎实但不炫耀，布洛迪的表演是全片最大的亮点。导演和男主角均获奥斯卡奖。影片本身获戛纳金棕榈奖。",
//             "ranking": "51",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/09/06/110952.46685238_96X128.jpg",
//             "type": "传记",
//             "year": "2002"
//         },
//         {
//             "name": "两杆大烟枪 Lock, Stock and Two Smoking Barrels (1998)",
//             "score": 8.6,
//             "introduction": "贝肯、汤姆、梭柏和艾迪四人欠上了帮派老大亨利一笔巨款，逾期一天就剁掉一只手指。他们会采取什么不法的手段来偿还这笔钱呢？",
//             "ranking": "52",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/232203.15587159_96X128.jpg",
//             "type": "喜剧",
//             "year": "1998"
//         },
//         {
//             "name": "死亡诗社 Dead Poets Society (1989)",
//             "score": 8.6,
//             "introduction": "一群受传统教育的学生和一位反传统教育的老师之间有什么是值得深思？学生们在无助的情况下所做的决定又是什么？《死亡诗社》回..",
//             "ranking": "53",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/19/114247.24944099_96X128.jpg",
//             "type": "喜剧",
//             "year": "1989"
//         },
//         {
//             "name": "活着 To Live (1994)",
//             "score": 8.6,
//             "introduction": "影片露出一股悲悯情怀和伤感的黑色幽默，它将历史浓缩为个人命运，而命如蝼蚁般的个人命运，只能是枉自兴叹的生命之痛。",
//             "ranking": "54",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/06/30/093845.87930039_96X128.jpg",
//             "type": "剧情",
//             "year": "1994"
//         },
//         {
//             "name": "幽灵公主 Princess Mononoke (1997)",
//             "score": 8.6,
//             "introduction": "《幽灵公主》主题是人与自然的关系，描述了人类为了发展技术力量不断破坏自然，从而受到自然的报复为之付出代价的故事。",
//             "ranking": "55",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230741.66801332_96X128.jpg",
//             "type": "动画",
//             "year": "1997"
//         },
//         {
//             "name": "杀人回忆 Memories of Murder (2003)",
//             "score": 8.6,
//             "introduction": "影片改编自韩国“三大未解悬案”之一的“雨夜连环强奸杀人案”，拍摄手法娴熟，张弛有度，确立了奉俊昊导演的个人表现风格。",
//             "ranking": "56",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225455.29950217_96X128.jpg",
//             "type": "犯罪",
//             "year": "2003"
//         },
//         {
//             "name": "无法触碰 Intouchables (2011)",
//             "score": 8.6,
//             "introduction": "本片是2011年法国影坛的最大黑马，上映四周观影人次超过1千8百万，成为年度票房冠军，并获东京电影节最佳影片奖。",
//             "ranking": "57",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/05/08/112850.71599127_96X128.jpg",
//             "type": "传记",
//             "year": "2011"
//         },
//         {
//             "name": "梦之安魂曲 Requiem for a Dream (2000)",
//             "score": 8.6,
//             "introduction": "通过一对母子各自的“瘾”，表现了生活中存在的形形色色的不良追求。导演达伦·阿罗诺夫斯以其大胆探索的表现方式闻名，本片令..",
//             "ranking": "58",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/234526.98936381_96X128.jpg",
//             "type": "剧情",
//             "year": "2000"
//         },
//         {
//             "name": "被嫌弃的松子的一生 Memories of Matsuko (2006)",
//             "score": 8.6,
//             "introduction": "悲剧性、戏剧性、寓言性和实在性多种元素，在中岛哲也的影像世界中融为一体，这是一个名叫松子的女人看似不幸的幸福故事。",
//             "ranking": "59",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/033724.51239358_96X128.jpg",
//             "type": "爱情",
//             "year": "2006"
//         },
//         {
//             "name": "一次别离 A Separation (2011)",
//             "score": 8.6,
//             "introduction": "导演阿斯哈·法哈蒂用他冷静、客观又充满关切的镜头风格，展现了当代伊朗人在亲情和宗教生活方面的纠结，影射批判了伊朗等级分..",
//             "ranking": "60",
//             "coverUrl": "http://img31.mtime.cn/mt/2012/10/26/100020.67786006_96X128.jpg",
//             "type": "剧情",
//             "year": "2011"
//         },
//         {
//             "name": "熔炉 Silenced (2011)",
//             "score": 8.6,
//             "introduction": "尽管难以置信，这一切还是发生了。影片根据真实事件改编，退伍归来的孔侑扮演一名正义感强烈的教授，带你揭开一所聋哑学校里不..",
//             "ranking": "61",
//             "coverUrl": "http://img21.mtime.cn/mt/2011/09/08/105047.59754019_96X128.jpg",
//             "type": "剧情",
//             "year": "2011"
//         },
//         {
//             "name": "与狼共舞 Dances with Wolves (1990)",
//             "score": 8.6,
//             "introduction": "美国白人军官邓巴在南北战争之后自愿到西部前线驻守，结果跟语言不通文化不同的苏族战士交上了朋友，并还改名为“与狼共舞”。",
//             "ranking": "62",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/231939.15704647_96X128.jpg",
//             "type": "西部",
//             "year": "1990"
//         },
//         {
//             "name": "罗生门 Rashômon (1950)",
//             "score": 8.6,
//             "introduction": "影片讲述了一件发生于竹林中发凶杀案，涉及盗贼、武士及妻子三人，武士被杀，妻子被强奸。由这三人的对话而正式展开。",
//             "ranking": "63",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225246.95159116_96X128.jpg",
//             "type": "犯罪",
//             "year": "1950"
//         },
//         {
//             "name": "卡萨布兰卡 Casablanca (1942)",
//             "score": 8.6,
//             "introduction": "在混合着危险的异国情调的浪漫中，男女主角在乱世重逢，亨佛莱·鲍嘉硬汉式的沧桑，和英格丽·褒曼沉默中的娇柔，各自都有着身..",
//             "ranking": "64",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/26/103652.90504519_96X128.jpg",
//             "type": "战争",
//             "year": "1942"
//         },
//         {
//             "name": "惊魂记 Psycho (1960)",
//             "score": 8.6,
//             "introduction": "这部拍摄于1960年的黑白片可谓恐怖惊悚片的经典代表之作，同时也是希区柯克首次探索精神分裂杀人狂的划时代视听艺术作品。",
//             "ranking": "65",
//             "coverUrl": "http://img31.mtime.cn/mt/2012/10/10/100916.37827530_96X128.jpg",
//             "type": "恐怖",
//             "year": "1960"
//         },
//         {
//             "name": "虎口脱险 La Grande vadrouille (1966)",
//             "score": 8.6,
//             "introduction": "二战期间，英国轰炸中队第一支遣队在执行一次名为“鸳鸯茶”的轰炸任务中，一架被德军防空武器击中，几个机上人员被迫跳伞逃生..",
//             "ranking": "66",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224746.27229741_96X128.jpg",
//             "type": "战争",
//             "year": "1966"
//         },
//         {
//             "name": "美丽人生 La Vita e bella (1997)",
//             "score": 8.5,
//             "introduction": "罗贝托·贝尼尼自导自演，本片发挥了高度创意，用妙想天开的方式将纳粹迫害犹太人的题材点石成金，颇有点卓别林喜剧的效果。",
//             "ranking": "67",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225339.79221242_96X128.jpg",
//             "type": "爱情",
//             "year": "1997"
//         },
//         {
//             "name": "让子弹飞 Let The Bullets Fly (2010)",
//             "score": 8.5,
//             "introduction": "虽然是姜文导演的商业作品，但紧张的节奏，幽默的对白，丰富的想象力，使电影仍然被贴着醒目的标签——姜文制造。",
//             "ranking": "68",
//             "coverUrl": "http://img21.mtime.cn/mt/2010/11/23/102316.52177023_96X128.jpg",
//             "type": "喜剧",
//             "year": "2010"
//         },
//         {
//             "name": "当幸福来敲门 The Pursuit of Happyness (2006)",
//             "score": 8.5,
//             "introduction": "一个穷途潦倒的单亲爸爸，因事业失败无家可归，却还得担起抚养儿子的重担。为了儿子的未来，他重新振作，终于皇天不负苦心人。",
//             "ranking": "69",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/10/25/165854.19018972_96X128.jpg",
//             "type": "传记",
//             "year": "2006"
//         },
//         {
//             "name": "剪刀手爱德华 Edward Scissorhands (1990)",
//             "score": 8.5,
//             "introduction": "一部机器人的爱情童话。影片的美工、布景、配乐非常出色。约翰尼·德普凭借眼神与姿态塑造出了影史上最令人难忘的形象之一。",
//             "ranking": "70",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/02/04/002655.71225669_96X128.jpg",
//             "type": "剧情",
//             "year": "1990"
//         },
//         {
//             "name": "熔炉 Silenced (2011)",
//             "score": 8.6,
//             "introduction": "尽管难以置信，这一切还是发生了。影片根据真实事件改编，退伍归来的孔侑扮演一名正义感强烈的教授，带你揭开一所聋哑学校里不..",
//             "ranking": "61",
//             "coverUrl": "http://img21.mtime.cn/mt/2011/09/08/105047.59754019_96X128.jpg",
//             "type": "剧情",
//             "year": "2011"
//         },
//         {
//             "name": "与狼共舞 Dances with Wolves (1990)",
//             "score": 8.6,
//             "introduction": "美国白人军官邓巴在南北战争之后自愿到西部前线驻守，结果跟语言不通文化不同的苏族战士交上了朋友，并还改名为“与狼共舞”。",
//             "ranking": "62",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/231939.15704647_96X128.jpg",
//             "type": "西部",
//             "year": "1990"
//         },
//         {
//             "name": "罗生门 Rashômon (1950)",
//             "score": 8.6,
//             "introduction": "影片讲述了一件发生于竹林中发凶杀案，涉及盗贼、武士及妻子三人，武士被杀，妻子被强奸。由这三人的对话而正式展开。",
//             "ranking": "63",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225246.95159116_96X128.jpg",
//             "type": "犯罪",
//             "year": "1950"
//         },
//         {
//             "name": "卡萨布兰卡 Casablanca (1942)",
//             "score": 8.6,
//             "introduction": "在混合着危险的异国情调的浪漫中，男女主角在乱世重逢，亨佛莱·鲍嘉硬汉式的沧桑，和英格丽·褒曼沉默中的娇柔，各自都有着身..",
//             "ranking": "64",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/26/103652.90504519_96X128.jpg",
//             "type": "战争",
//             "year": "1942"
//         },
//         {
//             "name": "惊魂记 Psycho (1960)",
//             "score": 8.6,
//             "introduction": "这部拍摄于1960年的黑白片可谓恐怖惊悚片的经典代表之作，同时也是希区柯克首次探索精神分裂杀人狂的划时代视听艺术作品。",
//             "ranking": "65",
//             "coverUrl": "http://img31.mtime.cn/mt/2012/10/10/100916.37827530_96X128.jpg",
//             "type": "恐怖",
//             "year": "1960"
//         },
//         {
//             "name": "虎口脱险 La Grande vadrouille (1966)",
//             "score": 8.6,
//             "introduction": "二战期间，英国轰炸中队第一支遣队在执行一次名为“鸳鸯茶”的轰炸任务中，一架被德军防空武器击中，几个机上人员被迫跳伞逃生..",
//             "ranking": "66",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224746.27229741_96X128.jpg",
//             "type": "战争",
//             "year": "1966"
//         },
//         {
//             "name": "美丽人生 La Vita e bella (1997)",
//             "score": 8.5,
//             "introduction": "罗贝托·贝尼尼自导自演，本片发挥了高度创意，用妙想天开的方式将纳粹迫害犹太人的题材点石成金，颇有点卓别林喜剧的效果。",
//             "ranking": "67",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225339.79221242_96X128.jpg",
//             "type": "爱情",
//             "year": "1997"
//         },
//         {
//             "name": "让子弹飞 Let The Bullets Fly (2010)",
//             "score": 8.5,
//             "introduction": "虽然是姜文导演的商业作品，但紧张的节奏，幽默的对白，丰富的想象力，使电影仍然被贴着醒目的标签——姜文制造。",
//             "ranking": "68",
//             "coverUrl": "http://img21.mtime.cn/mt/2010/11/23/102316.52177023_96X128.jpg",
//             "type": "喜剧",
//             "year": "2010"
//         },
//         {
//             "name": "当幸福来敲门 The Pursuit of Happyness (2006)",
//             "score": 8.5,
//             "introduction": "一个穷途潦倒的单亲爸爸，因事业失败无家可归，却还得担起抚养儿子的重担。为了儿子的未来，他重新振作，终于皇天不负苦心人。",
//             "ranking": "69",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/10/25/165854.19018972_96X128.jpg",
//             "type": "传记",
//             "year": "2006"
//         },
//         {
//             "name": "剪刀手爱德华 Edward Scissorhands (1990)",
//             "score": 8.5,
//             "introduction": "一部机器人的爱情童话。影片的美工、布景、配乐非常出色。约翰尼·德普凭借眼神与姿态塑造出了影史上最令人难忘的形象之一。",
//             "ranking": "70",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/02/04/002655.71225669_96X128.jpg",
//             "type": "剧情",
//             "year": "1990"
//         },
//         {
//             "name": "本杰明·巴顿奇事 The Curious Case of Benjamin Button (2008)",
//             "score": 8.5,
//             "introduction": "本杰明以老人形象降生人世，之后越活越年轻。11岁时，他遇上了6岁的黛西，两人在成长中相恋，然而本杰明奇特的生命却成了障碍。",
//             "ranking": "71",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/02/29/085022.89316381_96X128.jpg",
//             "type": "剧情",
//             "year": "2008"
//         },
//         {
//             "name": "七宗罪 Se7en (1995)",
//             "score": 8.5,
//             "introduction": "天主教中有七种死罪，然而一场离奇的连环杀人案，受害者都是死于这七宗罪其中的一种。凶手下一个目标将会是谁？",
//             "ranking": "72",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225559.82379890_96X128.jpg",
//             "type": "犯罪",
//             "year": "1995"
//         },
//         {
//             "name": "勇敢的心 Braveheart (1995)",
//             "score": 8.5,
//             "introduction": "本片以13-14世纪英格兰的宫廷政治为背景，以战争为核心，讲述了苏格兰起义领袖威廉·华莱士与英格兰统治者不屈不挠斗争的故事。",
//             "ranking": "73",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230733.90049340_96X128.jpg",
//             "type": "传记",
//             "year": "1995"
//         },
//         {
//             "name": "无间道 Infernal Affairs (2002)",
//             "score": 8.5,
//             "introduction": "这部电影无疑是多年来的香港警匪类型片的新突破，影片一改以往单一的线索和节奏，而将重点完全放到人物身上。",
//             "ranking": "74",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230340.66768202_96X128.jpg",
//             "type": "惊悚",
//             "year": "2002"
//         },
//         {
//             "name": "楚门的世界 The Truman Show (1998)",
//             "score": 8.5,
//             "introduction": "金·凯瑞以其讨人喜爱的正派形象，还有关键时候怒火的爆发力，诠释了一个终生被人摆布、遭人愚弄的普通人典型。",
//             "ranking": "75",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224224.35649043_96X128.jpg",
//             "type": "剧情",
//             "year": "1998"
//         },
//         {
//             "name": "哈利·波特与死亡圣器(下) Harry Potter and the Deathly Hallows: Part 2 (2011)",
//             "score": 8.5,
//             "introduction": "作为这部跨度十年、有着众多拥趸的奇幻史诗的终结篇，最引人瞩目就是哈利·波特和伏地魔在霍格沃茨的终极大战。",
//             "ranking": "76",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/09/09/121730.50602138_96X128.jpg",
//             "type": "冒险",
//             "year": "2011"
//         },
//         {
//             "name": "黑天鹅 Black Swan (2010)",
//             "score": 8.5,
//             "introduction": "影片讲述了一个女芭蕾舞演员的故事，从许多方面看，这部电影都是艺术家对自我世界的一次探索，为了完美而不惜一切代价。",
//             "ranking": "77",
//             "coverUrl": "http://img21.mtime.cn/mt/2010/11/17/093405.85766396_96X128.jpg",
//             "type": "剧情",
//             "year": "2010"
//         },
//         {
//             "name": "驯龙高手 How to Train Your Dragon (2010)",
//             "score": 8.5,
//             "introduction": "维京小男孩小嗝嗝一直梦想着能像父辈那样屠龙，他击落了一条小龙，却最终和小龙成了朋友，他的世界也从此彻底改变。",
//             "ranking": "78",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/13/101557.45115810_96X128.jpg",
//             "type": "动画",
//             "year": "2010"
//         },
//         {
//             "name": "大鱼 Big Fish (2003)",
//             "score": 8.5,
//             "introduction": "威利在临终的父亲身旁，根据父亲讲述的那些经历虚构他所度过的光辉岁月。在这个过程中，威尔渐渐体会到父亲当时的心情……",
//             "ranking": "79",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/27/102640.36705068_96X128.jpg",
//             "type": "奇幻",
//             "year": "2003"
//         },
//         {
//             "name": "沉默的羔羊 The Silence of the Lambs (1991)",
//             "score": 8.5,
//             "introduction": "联邦调查局见习特工克拉丽斯为了解变态杀人犯“野牛比尔”的的特殊心理，与精神变态的精神病专家汉尼拔博士进行接触。",
//             "ranking": "80",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/27/155600.64678027_96X128.jpg",
//             "type": "犯罪",
//             "year": "1991"
//         },
//         {
//             "name": "本杰明·巴顿奇事 The Curious Case of Benjamin Button (2008)",
//             "score": 8.5,
//             "introduction": "本杰明以老人形象降生人世，之后越活越年轻。11岁时，他遇上了6岁的黛西，两人在成长中相恋，然而本杰明奇特的生命却成了障碍。",
//             "ranking": "71",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/02/29/085022.89316381_96X128.jpg",
//             "type": "剧情",
//             "year": "2008"
//         },
//         {
//             "name": "七宗罪 Se7en (1995)",
//             "score": 8.5,
//             "introduction": "天主教中有七种死罪，然而一场离奇的连环杀人案，受害者都是死于这七宗罪其中的一种。凶手下一个目标将会是谁？",
//             "ranking": "72",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225559.82379890_96X128.jpg",
//             "type": "犯罪",
//             "year": "1995"
//         },
//         {
//             "name": "勇敢的心 Braveheart (1995)",
//             "score": 8.5,
//             "introduction": "本片以13-14世纪英格兰的宫廷政治为背景，以战争为核心，讲述了苏格兰起义领袖威廉·华莱士与英格兰统治者不屈不挠斗争的故事。",
//             "ranking": "73",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230733.90049340_96X128.jpg",
//             "type": "传记",
//             "year": "1995"
//         },
//         {
//             "name": "无间道 Infernal Affairs (2002)",
//             "score": 8.5,
//             "introduction": "这部电影无疑是多年来的香港警匪类型片的新突破，影片一改以往单一的线索和节奏，而将重点完全放到人物身上。",
//             "ranking": "74",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230340.66768202_96X128.jpg",
//             "type": "惊悚",
//             "year": "2002"
//         },
//         {
//             "name": "楚门的世界 The Truman Show (1998)",
//             "score": 8.5,
//             "introduction": "金·凯瑞以其讨人喜爱的正派形象，还有关键时候怒火的爆发力，诠释了一个终生被人摆布、遭人愚弄的普通人典型。",
//             "ranking": "75",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224224.35649043_96X128.jpg",
//             "type": "剧情",
//             "year": "1998"
//         },
//         {
//             "name": "哈利·波特与死亡圣器(下) Harry Potter and the Deathly Hallows: Part 2 (2011)",
//             "score": 8.5,
//             "introduction": "作为这部跨度十年、有着众多拥趸的奇幻史诗的终结篇，最引人瞩目就是哈利·波特和伏地魔在霍格沃茨的终极大战。",
//             "ranking": "76",
//             "coverUrl": "http://img31.mtime.cn/mt/2016/09/09/121730.50602138_96X128.jpg",
//             "type": "冒险",
//             "year": "2011"
//         },
//         {
//             "name": "黑天鹅 Black Swan (2010)",
//             "score": 8.5,
//             "introduction": "影片讲述了一个女芭蕾舞演员的故事，从许多方面看，这部电影都是艺术家对自我世界的一次探索，为了完美而不惜一切代价。",
//             "ranking": "77",
//             "coverUrl": "http://img21.mtime.cn/mt/2010/11/17/093405.85766396_96X128.jpg",
//             "type": "剧情",
//             "year": "2010"
//         },
//         {
//             "name": "驯龙高手 How to Train Your Dragon (2010)",
//             "score": 8.5,
//             "introduction": "维京小男孩小嗝嗝一直梦想着能像父辈那样屠龙，他击落了一条小龙，却最终和小龙成了朋友，他的世界也从此彻底改变。",
//             "ranking": "78",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/03/13/101557.45115810_96X128.jpg",
//             "type": "动画",
//             "year": "2010"
//         },
//         {
//             "name": "大鱼 Big Fish (2003)",
//             "score": 8.5,
//             "introduction": "威利在临终的父亲身旁，根据父亲讲述的那些经历虚构他所度过的光辉岁月。在这个过程中，威尔渐渐体会到父亲当时的心情……",
//             "ranking": "79",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/11/27/102640.36705068_96X128.jpg",
//             "type": "奇幻",
//             "year": "2003"
//         },
//         {
//             "name": "沉默的羔羊 The Silence of the Lambs (1991)",
//             "score": 8.5,
//             "introduction": "联邦调查局见习特工克拉丽斯为了解变态杀人犯“野牛比尔”的的特殊心理，与精神变态的精神病专家汉尼拔博士进行接触。",
//             "ranking": "80",
//             "coverUrl": "http://img31.mtime.cn/mt/2013/12/27/155600.64678027_96X128.jpg",
//             "type": "犯罪",
//             "year": "1991"
//         },
//         {
//             "name": "V字仇杀队 V for Vendetta (2005)",
//             "score": 8.5,
//             "introduction": "影片根据著名作家阿兰·摩尔的同名绘本小说改编，故事发生在虚构的未来，德国赢得了二次大战，英国成为极权国家。一个代号..",
//             "ranking": "81",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/013251.13840945_96X128.jpg",
//             "type": "动作",
//             "year": "2005"
//         },
//         {
//             "name": "美丽心灵 A Beautiful Mind (2001)",
//             "score": 8.5,
//             "introduction": "数学家纳什读研究生时就发现了著名的博弈论，但却受到了精神分裂症的困扰。他在妻子艾丽西亚的相助下顽强抗争，并获诺贝尔奖。",
//             "ranking": "82",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225340.28990943_96X128.jpg",
//             "type": "剧情",
//             "year": "2001"
//         },
//         {
//             "name": "被解救的姜戈 Django Unchained (2012)",
//             "score": 8.5,
//             "introduction": "本片是昆汀向经典西部片的致敬之作，姜戈是一名获得了自由的黑人奴隶，在一名德国裔赏金猎人的帮助下，决心将妻子解救出来。",
//             "ranking": "83",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/01/10/095325.27597389_96X128.jpg",
//             "type": "剧情",
//             "year": "2012"
//         },
//         {
//             "name": "告白 Confessions (2010)",
//             "score": 8.5,
//             "introduction": "影片改编自凑佳苗的同名处女作小说，故事涉及校园欺凌、未成年人杀害儿童、个人复仇等冲击性内容，导演是视觉系中岛哲也。",
//             "ranking": "84",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/082621.99364976_96X128.jpg",
//             "type": "剧情",
//             "year": "2010"
//         },
//         {
//             "name": "燃情岁月 Legends of the Fall (1994)",
//             "score": 8.5,
//             "introduction": "一名退伍军人，因为厌恶杀戮，带着三个儿子在蒙大拿的乡野过着牧园生活。三兄弟长大后，却陷入了有违亲情的爱情之中。",
//             "ranking": "85",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/232245.78303334_96X128.jpg",
//             "type": "爱情",
//             "year": "1994"
//         },
//         {
//             "name": "无敌破坏王 Wreck-It Ralph (2012)",
//             "score": 8.5,
//             "introduction": "破坏王连续30年一直在游戏世界里做反派，于是某天他决心离开自己的游戏去闯荡别的电玩世界，证明自己也可以做个英雄。",
//             "ranking": "86",
//             "coverUrl": "http://img5.mtime.cn/mt/2017/02/08/122416.52755570_96X128.jpg",
//             "type": "动画",
//             "year": "2012"
//         },
//         {
//             "name": "阳光灿烂的日子 In the Heat of the Sun (1994)",
//             "score": 8.5,
//             "introduction": "从某种角度来看，影片就是姜文的“成人仪式”，在这个仪式过后，彻底确立了姜文作为一个才情卓绝的导演的独特地位。",
//             "ranking": "87",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230610.79698700_96X128.jpg",
//             "type": "剧情",
//             "year": "1994"
//         },
//         {
//             "name": "摔跤吧！爸爸 Dangal (2016)",
//             "score": 8.5,
//             "introduction": "本片为Mahavir Singh Phogat教授自己的两个女儿Babita Kumari和Geeta Phogat摔跤的传记片。Geeta后来成为了印度第一位女性摔跤..",
//             "ranking": "88",
//             "coverUrl": "http://img5.mtime.cn/mt/2017/05/05/095011.35177856_96X128.jpg",
//             "type": "动作",
//             "year": "2016"
//         },
//         {
//             "name": "上帝之城 City of God (2002)",
//             "score": 8.5,
//             "introduction": "影片改编自巴西作家帕洛林的同名小说，精彩呈现了跨越1960年到1980年，巴西里约卫星城贫民区的黑街帮派犯罪实录。",
//             "ranking": "89",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225818.35067028_96X128.jpg",
//             "type": "剧情",
//             "year": "2002"
//         },
//         {
//             "name": "窃听风暴 Das Leben der Anderen (2006)",
//             "score": 8.5,
//             "introduction": "时间是1984年，地点是在东德柏林，每一次的开头字幕出现的是“公开化无处不在”。全东德百姓被一百万史塔西秘密警察控制着，还..",
//             "ranking": "90",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/032927.46582257_96X128.jpg",
//             "type": "剧情",
//             "year": "2006"
//         },
//         {
//             "name": "V字仇杀队 V for Vendetta (2005)",
//             "score": 8.5,
//             "introduction": "影片根据著名作家阿兰·摩尔的同名绘本小说改编，故事发生在虚构的未来，德国赢得了二次大战，英国成为极权国家。一个代号..",
//             "ranking": "81",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/013251.13840945_96X128.jpg",
//             "type": "动作",
//             "year": "2005"
//         },
//         {
//             "name": "美丽心灵 A Beautiful Mind (2001)",
//             "score": 8.5,
//             "introduction": "数学家纳什读研究生时就发现了著名的博弈论，但却受到了精神分裂症的困扰。他在妻子艾丽西亚的相助下顽强抗争，并获诺贝尔奖。",
//             "ranking": "82",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225340.28990943_96X128.jpg",
//             "type": "剧情",
//             "year": "2001"
//         },
//         {
//             "name": "被解救的姜戈 Django Unchained (2012)",
//             "score": 8.5,
//             "introduction": "本片是昆汀向经典西部片的致敬之作，姜戈是一名获得了自由的黑人奴隶，在一名德国裔赏金猎人的帮助下，决心将妻子解救出来。",
//             "ranking": "83",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/01/10/095325.27597389_96X128.jpg",
//             "type": "剧情",
//             "year": "2012"
//         },
//         {
//             "name": "告白 Confessions (2010)",
//             "score": 8.5,
//             "introduction": "影片改编自凑佳苗的同名处女作小说，故事涉及校园欺凌、未成年人杀害儿童、个人复仇等冲击性内容，导演是视觉系中岛哲也。",
//             "ranking": "84",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/082621.99364976_96X128.jpg",
//             "type": "剧情",
//             "year": "2010"
//         },
//         {
//             "name": "燃情岁月 Legends of the Fall (1994)",
//             "score": 8.5,
//             "introduction": "一名退伍军人，因为厌恶杀戮，带着三个儿子在蒙大拿的乡野过着牧园生活。三兄弟长大后，却陷入了有违亲情的爱情之中。",
//             "ranking": "85",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/232245.78303334_96X128.jpg",
//             "type": "爱情",
//             "year": "1994"
//         },
//         {
//             "name": "无敌破坏王 Wreck-It Ralph (2012)",
//             "score": 8.5,
//             "introduction": "破坏王连续30年一直在游戏世界里做反派，于是某天他决心离开自己的游戏去闯荡别的电玩世界，证明自己也可以做个英雄。",
//             "ranking": "86",
//             "coverUrl": "http://img5.mtime.cn/mt/2017/02/08/122416.52755570_96X128.jpg",
//             "type": "动画",
//             "year": "2012"
//         },
//         {
//             "name": "阳光灿烂的日子 In the Heat of the Sun (1994)",
//             "score": 8.5,
//             "introduction": "从某种角度来看，影片就是姜文的“成人仪式”，在这个仪式过后，彻底确立了姜文作为一个才情卓绝的导演的独特地位。",
//             "ranking": "87",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/230610.79698700_96X128.jpg",
//             "type": "剧情",
//             "year": "1994"
//         },
//         {
//             "name": "摔跤吧！爸爸 Dangal (2016)",
//             "score": 8.5,
//             "introduction": "本片为Mahavir Singh Phogat教授自己的两个女儿Babita Kumari和Geeta Phogat摔跤的传记片。Geeta后来成为了印度第一位女性摔跤..",
//             "ranking": "88",
//             "coverUrl": "http://img5.mtime.cn/mt/2017/05/05/095011.35177856_96X128.jpg",
//             "type": "动作",
//             "year": "2016"
//         },
//         {
//             "name": "上帝之城 City of God (2002)",
//             "score": 8.5,
//             "introduction": "影片改编自巴西作家帕洛林的同名小说，精彩呈现了跨越1960年到1980年，巴西里约卫星城贫民区的黑街帮派犯罪实录。",
//             "ranking": "89",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225818.35067028_96X128.jpg",
//             "type": "剧情",
//             "year": "2002"
//         },
//         {
//             "name": "窃听风暴 Das Leben der Anderen (2006)",
//             "score": 8.5,
//             "introduction": "时间是1984年，地点是在东德柏林，每一次的开头字幕出现的是“公开化无处不在”。全东德百姓被一百万史塔西秘密警察控制着，还..",
//             "ranking": "90",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/23/032927.46582257_96X128.jpg",
//             "type": "剧情",
//             "year": "2006"
//         },
//         {
//             "name": "荒野生存 Into the Wild (2007)",
//             "score": 8.5,
//             "introduction": "24岁的理想主义青年克里斯托佛义无反顾的前往荒蛮之地阿拉斯加，将挑战极限的生存方式一直坚持到生命的最后一刻。",
//             "ranking": "91",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/07/16/105315.54085005_96X128.jpg",
//             "type": "冒险",
//             "year": "2007"
//         },
//         {
//             "name": "春光乍泄 Happy Together (1997)",
//             "score": 8.5,
//             "introduction": "男人之间的爱情，无论是感情的起浮波折还是调情、斗气和男女之间的爱情一样炽烈感人，十分纯真，完全摆脱了性别枷锁。",
//             "ranking": "92",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224231.28364958_96X128.jpg",
//             "type": "爱情",
//             "year": "1997"
//         },
//         {
//             "name": "绿里奇迹 The Green Mile (1999)",
//             "score": 8.5,
//             "introduction": "改编自史蒂芬·金畅销小说，影片一脉相承了导演达拉邦特前作《肖申克的救赎》里体现的思想精髓，那就是希望无处不在。",
//             "ranking": "93",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225236.32859555_96X128.jpg",
//             "type": "奇幻",
//             "year": "1999"
//         },
//         {
//             "name": "碧海蓝天 Le Grand Bleu (1988)",
//             "score": 8.5,
//             "introduction": "本片为1988年戛纳影展的开幕大片，描述个人难以融入现实社会的困境中，因此转而寻找梦想中的另一种生活，带著浓厚的自传色彩。",
//             "ranking": "94",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/04/08/151752.10498184_96X128.jpg",
//             "type": "爱情",
//             "year": "1988"
//         },
//         {
//             "name": "出租车司机 Taxi Driver (1976)",
//             "score": 8.5,
//             "introduction": "《出租汽车司机》是斯科西斯最具里程碑意义的一部作品，影片所蕴涵的现实意义和深刻思想足以被列为世界百年电影中的极品。",
//             "ranking": "95",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224222.52138134_96X128.jpg",
//             "type": "犯罪",
//             "year": "1976"
//         },
//         {
//             "name": "爱在日落黄昏时 Before Sunset (2004)",
//             "score": 8.5,
//             "introduction": "在《日出之前》过去九年后，杰西和塞琳娜在巴黎重逢。两人将在这里共度一个下午，在日落之前他们会做出怎样的决定？",
//             "ranking": "96",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/234917.63150133_96X128.jpg",
//             "type": "剧情",
//             "year": "2004"
//         },
//         {
//             "name": "爱在黎明破晓前 Before Sunrise (1995)",
//             "score": 8.5,
//             "introduction": "两位旅人，从素不相识到眼光交融，如同旧时的王子和他的灰姑娘，本只有一夜的宿命却因为他的大胆邀约，她的欣然允答得以了延续..",
//             "ranking": "97",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/01/26/141827.42841057_96X128.jpg",
//             "type": "剧情",
//             "year": "1995"
//         },
//         {
//             "name": "风之谷 Nausicaä of the Valley of the Winds (1984)",
//             "score": 8.5,
//             "introduction": "宫崎骏挥洒想象力构筑出一个神奇的幻想世界。影片的主角是一位纤弱善良的少女，面对侵略，她勇敢地背负起拯救家乡的使命。",
//             "ranking": "98",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224507.35502246_96X128.jpg",
//             "type": "动画",
//             "year": "1984"
//         },
//         {
//             "name": "饮食男女 Eat Drink Man Woman (1994)",
//             "score": 8.5,
//             "introduction": "李安执导的《饮食男女》，把中国烹调艺术带入家庭和情感的戏剧之中，不仅增加了可视性而且展现了东方文化迷人的魅力。",
//             "ranking": "99",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/07/30/194640.75613859_96X128.jpg",
//             "type": "爱情",
//             "year": "1994"
//         },
//         {
//             "name": "爆裂鼓手 Whiplash (2014)",
//             "score": 0,
//             "introduction": "安德烈是著名音乐学院的新生，他一心想成为查理·帕克那样的传奇鼓手。加入竞争激烈的校爵士乐队似乎让他看到了一线接近梦想的..",
//             "ranking": "100",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/12/12/090529.45635509_96X128.jpg",
//             "type": "剧情",
//             "year": "2014"
//         },
//         {
//             "name": "荒野生存 Into the Wild (2007)",
//             "score": 8.5,
//             "introduction": "24岁的理想主义青年克里斯托佛义无反顾的前往荒蛮之地阿拉斯加，将挑战极限的生存方式一直坚持到生命的最后一刻。",
//             "ranking": "91",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/07/16/105315.54085005_96X128.jpg",
//             "type": "冒险",
//             "year": "2007"
//         },
//         {
//             "name": "春光乍泄 Happy Together (1997)",
//             "score": 8.5,
//             "introduction": "男人之间的爱情，无论是感情的起浮波折还是调情、斗气和男女之间的爱情一样炽烈感人，十分纯真，完全摆脱了性别枷锁。",
//             "ranking": "92",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224231.28364958_96X128.jpg",
//             "type": "爱情",
//             "year": "1997"
//         },
//         {
//             "name": "绿里奇迹 The Green Mile (1999)",
//             "score": 8.5,
//             "introduction": "改编自史蒂芬·金畅销小说，影片一脉相承了导演达拉邦特前作《肖申克的救赎》里体现的思想精髓，那就是希望无处不在。",
//             "ranking": "93",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/225236.32859555_96X128.jpg",
//             "type": "奇幻",
//             "year": "1999"
//         },
//         {
//             "name": "碧海蓝天 Le Grand Bleu (1988)",
//             "score": 8.5,
//             "introduction": "本片为1988年戛纳影展的开幕大片，描述个人难以融入现实社会的困境中，因此转而寻找梦想中的另一种生活，带著浓厚的自传色彩。",
//             "ranking": "94",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/04/08/151752.10498184_96X128.jpg",
//             "type": "爱情",
//             "year": "1988"
//         },
//         {
//             "name": "出租车司机 Taxi Driver (1976)",
//             "score": 8.5,
//             "introduction": "《出租汽车司机》是斯科西斯最具里程碑意义的一部作品，影片所蕴涵的现实意义和深刻思想足以被列为世界百年电影中的极品。",
//             "ranking": "95",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224222.52138134_96X128.jpg",
//             "type": "犯罪",
//             "year": "1976"
//         },
//         {
//             "name": "爱在日落黄昏时 Before Sunset (2004)",
//             "score": 8.5,
//             "introduction": "在《日出之前》过去九年后，杰西和塞琳娜在巴黎重逢。两人将在这里共度一个下午，在日落之前他们会做出怎样的决定？",
//             "ranking": "96",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/234917.63150133_96X128.jpg",
//             "type": "剧情",
//             "year": "2004"
//         },
//         {
//             "name": "爱在黎明破晓前 Before Sunrise (1995)",
//             "score": 8.5,
//             "introduction": "两位旅人，从素不相识到眼光交融，如同旧时的王子和他的灰姑娘，本只有一夜的宿命却因为他的大胆邀约，她的欣然允答得以了延续..",
//             "ranking": "97",
//             "coverUrl": "http://img31.mtime.cn/mt/2015/01/26/141827.42841057_96X128.jpg",
//             "type": "剧情",
//             "year": "1995"
//         },
//         {
//             "name": "风之谷 Nausicaä of the Valley of the Winds (1984)",
//             "score": 8.5,
//             "introduction": "宫崎骏挥洒想象力构筑出一个神奇的幻想世界。影片的主角是一位纤弱善良的少女，面对侵略，她勇敢地背负起拯救家乡的使命。",
//             "ranking": "98",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/02/22/224507.35502246_96X128.jpg",
//             "type": "动画",
//             "year": "1984"
//         },
//         {
//             "name": "饮食男女 Eat Drink Man Woman (1994)",
//             "score": 8.5,
//             "introduction": "李安执导的《饮食男女》，把中国烹调艺术带入家庭和情感的戏剧之中，不仅增加了可视性而且展现了东方文化迷人的魅力。",
//             "ranking": "99",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/07/30/194640.75613859_96X128.jpg",
//             "type": "爱情",
//             "year": "1994"
//         },
//         {
//             "name": "爆裂鼓手 Whiplash (2014)",
//             "score": 0,
//             "introduction": "安德烈是著名音乐学院的新生，他一心想成为查理·帕克那样的传奇鼓手。加入竞争激烈的校爵士乐队似乎让他看到了一线接近梦想的..",
//             "ranking": "100",
//             "coverUrl": "http://img31.mtime.cn/mt/2014/12/12/090529.45635509_96X128.jpg",
//             "type": "剧情",
//             "year": "2014"
//         }
//     ]
//     return d
// }

const fetchMovies = function() {
    // 使用 ajax 动态获取数据
    var request = {
        method: 'GET',
        url: '/api/movie/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            console.log('响应', response)
            var movies = JSON.parse(response)
            renderChart(movies)
        }
    }
    ajax(request)

    // 直接使用 JSON 数据 不从后台获取
    // var d = movieJSON()
    // renderChart(d)
}

const initedChart = function() {
    _.each(chartStore, (v, k) => {
        const element = document.getElementById(k)
        const chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = function() {
    initedChart()
    fetchMovies()
}

// $(document).ready() 是 jQuery 的回调函数
// 是页面内容(只包括元素, 不包括元素引用的图片)载入完毕之后的回调事件
$(document).ready(function() {
    __main()
})
