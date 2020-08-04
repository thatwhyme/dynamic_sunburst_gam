const colorMap = {
    normal: '#6699FF',
    red_process: '#e14089',//when the red player just choose a node, it becomes red.
    blue_end: '#9966FF',//it is the blue player's normal end.   purple
    blue_dark_end:'#663399', //when blue player's end appears in the dummy area.  drak purple
    red_end: 'lightgreen', // when the red player's strategy is resolved, it becomes lightgreen
    predictcolor:'#056E5F'
}

function getColor(d) {

    if (d.data.isDummy && !d.data.blue && !d.data.predictcolor) return d.data.dummy_color

    if (d.data.red_process) {
        return colorMap.red_process
    }else if(d.data.red_end){
        return  colorMap.red_end
    } else if (d.data.blue) {
        // key3
        if(d.data.isDummy){ 
            return colorMap.blue_dark_end
        }else{
            return colorMap.blue_end 
        }
    }else if(d.data.predictcolor){ 
        return colorMap.predictcolor
    }else if(d.data.normal) { 
        return colorMap.normal
    }
}

// let status = 'process'
let next = 'red'
let Recording = []; //This is used to record every step

const tree = {
    label: '0',
    children: [],
    color: colorMap.未选择,
    isLeaf: false,
    dummy: new Set(),
}

const depth = 7
const cache = {
    0: [tree]
}


let beginLabel = Math.pow(2,depth-1)-1;
let endLabel = 2 * beginLabel;

let DUMMY = false  
let redNowLabel =  ''
let blueClickCount = 1
let blueSelectLabel = []
let count = 1
let isDoubleLabel = label => {
    return /\d+\/\d+/g.test(label)
}
function error(msg){
    alert(msg || 'Blue Error！！')
}
for (let i = 0; i < depth - 1; i++) {
    cache[i + 1] = []
    for(let c of cache[i]) {
        let c1 = {
            label: count++ + '',
            children: [],
            isLeaf: i === depth - 2,
            p: c,
            dummy: new Set(),
            isDummy: false,
            normal:true,
            red_end:false,
            red_process:false,
            blue:false,
            predictcolor:false

        }
        let c2 = {
            label: count++ + '',
            children: [],
            isLeaf: i === depth - 2,
            p:c,
            dummy: new Set(),
            isDummy: false,
            normal:true,
            red_end:false,
            red_process:false,
            blue:false,
            predictcolor:false
        }
        if (i === depth - 2) {
            c1.size = i
            c2.size = i
        }
        c.children = [c1, c2]
        cache[i+1].push(c1, c2)
    }
}

function checkNodeCanClick(d){ //check for blue player
    if(!d.data.predictcolor) return false  
    return true
}
const single = {  //single label of red player suitation (leaf node)
    check(bluelabel, redlabel) {   //check the strategy of blue player
        let blueNode = findNodeTo(tree, bluelabel)
        let redNode = findNodeTo(tree, redlabel)
        while (blueNode !== redNode) {
            let _r_label = redNode.label.split('/')[0]
            let _b_label = blueNode.label.split('/')
            if (_b_label.length === 2 && !_b_label.includes(_r_label)) {
                // error()
                // console.log("location 1 :" + _b_label + " : "　+ _r_label)
                return false
            }
            blueNode = blueNode.p
            redNode = redNode.p
        }
        return true
    },

    handle(bluelabel, redlabel) {   //change the corresponding color and label
        let blueNode = findNodeTo(tree, bluelabel)
        let redNode = findNodeTo(tree, redlabel)
        while (blueNode !== redNode) {
            if (!isDoubleLabel(blueNode.label)) {
                blueNode.label += '/' + redNode.label.split('/')[0]
                tmpLayer ++
                blueNode.blue = true  
                blueNode.normal = false
                blueNode = blueNode.p
                redNode = redNode.p
            }else{
                break
            } 
        }
    }
}

const double = {    //double labels of red player suitation (leaf node)
    check(label1, label2, redlabel){  //check the strategy of blue player
        let node1 = findNodeTo(tree, label1)
        let node2 = findNodeTo(tree, label2)
        let rednode = findNodeTo(tree, redlabel)
        let flag1 = 0  // flag for rednode and node1
        let flag2 = 0 // flag for rednode and node2
        let flag3 = 0 // flag for node2 and node1
        while (rednode !== node1 || rednode !== node2 || node1 !== node2) {
            const _n1_label = node1.label.split('/')
            const _n2_label = node2.label.split('/')
            const _r_label = rednode.label.split('/')
        
            if(rednode === node1){
                flag1 = 1
            }
            if(rednode === node2){
                flag2 = 1
            }
            if(node2 === node1){
                flag3 = 1
            }
            if(flag1 === 1 && flag2 === 1 && flag3 === 1){
                break   //means the three nodes come to the same node.
            }

            if(flag1 === 0 && flag2 === 0 && flag3 === 0){  //means the three nodes are totally different
                if (_r_label.length === 2 && ( (_n1_label.length === 2 && !_n1_label.includes(_r_label[0])) || (_n2_label.length === 2 && !_n2_label.includes(_r_label[1])))) {
                    // er ror()
                    return false
                }
                if((_r_label.length === 1 || (_r_label.length === 2 && _r_label[0] === _r_label[1] )) && ( (_n1_label.length === 2 && !_n1_label.includes(_r_label[0])) || (_n2_label.length === 2 && !_n2_label.includes(_r_label[0])))){
                    // error()
                    return false
                }
            }

            if(flag1 === 1 && flag2 === 0 && flag3 === 0){   // A
                // alert("aaaA")
                if(_r_label.length === 2  && _n2_label.length ==2 && !_n2_label.includes(_r_label[1])){
                    // alert("aaaA1")
                    // error()
                    return false
                }
                if(_r_label.length === 1 && _n2_label.length === 2 && !_n2_label.includes(_r_label[0])){
                    // alert("aaaA2")
                    // error()
                    return false
                }    
            }

            if(flag1 === 0 && flag2 === 1 && flag3 === 0){  //B
                // alert("bbbB")
                if(_r_label.length === 2   && _n1_label.length ==2 && !_n1_label.includes(_r_label[0])){
                    // error()
                    return false
                }

                if(_r_label.length === 1 && _n1_label.length === 2 && !_n1_label.includes(_r_label[0])){
                    // error()
                    return false
                }
            }

            if(flag1 === 0 && flag2 === 0 && flag3 === 1){   //C
                // alert("aaaC")
                if (_r_label.length === 2 && (_n1_label.length === 2 && (!_n1_label.includes(_r_label[0]) ||!_n1_label.includes(_r_label[1]))
                    || _n1_label.length === 1 && !_r_label.includes(_n1_label[0]) )
                   ) {
                    // error()
                    return false
                }
                if(_r_label.length === 1 && _n1_label.length === 2 && !_n1_label.includes(_r_label[0])){
                    // error()
                    return false
                }
            }

            node1 = node1.p
            node2 = node2.p
            rednode = rednode.p
        }
        return true
    },

    handle(label1, label2, redlabel){  //change the corresponding color and label
        let node1 = findNodeTo(tree, label1)
        let node2 = findNodeTo(tree, label2)
        let rednode = findNodeTo(tree, redlabel)

        let flag1 = 0  
        let flag2 = 0 
        let flag3 = 0 

        while (rednode !== node1 || rednode !== node2 || node1 !== node2) {
            const _n1_label = node1.label.split('/')
            const _n2_label = node2.label.split('/')
            const _r_label = rednode.label.split('/')
            
            if(rednode === node1){
                flag1 = 1
            }
            if(rednode === node2){
                flag2 = 1
            }
            if(node2 === node1){
                flag3 = 1
            }

            if(flag1 ===1 && flag2 === 1 && flag3 === 1){
                break   
            }

            if(flag1 === 0 && flag2 === 0 && flag3 === 0){ 
                if (_n1_label.length === 1) {
                    node1.label += '/' + _r_label[0]
                    node1.blue = true
                    tmpLayer1 ++
                    // node1.dummy_color = false  //no matter the blueNode is dummy or not, it should become purple first
                }

                if (_n2_label.length === 1) {
                    if(_r_label.length === 2){
                        if(_n2_label[0] !== _r_label[1]){
                            node2.label += '/' + _r_label[1]
                        }
                    }else{
                        node2.label += '/' + _r_label[0]
                    }
                    node2.blue = true
                    tmpLayer2 ++ 
                }
            }

            if(flag1 === 1 && flag2 === 0 && flag3 === 0){   // A
                if (_n2_label.length === 1) {
                    if(_r_label.length === 2){
                        if (_n2_label[0] !== _r_label[1]) {
                            node2.label += '/' + _r_label[1]  
                        }
                    }else{
                        node2.label += '/' + _r_label[0]
                    }                    
                    node2.blue = true
                    tmpLayer2 ++
                }
            }

            if(flag1 === 0 && flag2 === 1 && flag3 === 0){   // B
                if (_n1_label.length === 1) {
                    node1.label += '/' + _r_label[0]
                    node1.blue = true
                    tmpLayer1 ++
                }
            }

            if(flag1 === 0 && flag2 === 0 && flag3 === 1){   // C
                if (_n1_label.length === 1) {
                    node1.label += '/' + _r_label[0]
                    node1.blue = true 

                    tmpLayer1 ++
                    tmpLayer2 ++
                }
            }
            node1 = node1.p
            node2 = node2.p
            rednode = rednode.p
        }
    }
}

function onlclick(d) {   //left click  for  red player
    console.log("next:"+next)
    if (next !== 'red') return
    if (d.data.red_end) return
    if (d.data.isDummy) {//isDummy(d.data.label)
        error('Dummy Error !!')
        return
    }
    insertDummy(d.data.label)
    next = 'blue'
    // status = 'process'
    redNowLabel = d.data.label

    if (isDoubleLabel(redNowLabel)){
        FLAGPlayer = 2
    }else{
        FLAGPlayer = 1
    }
	
    findNodeTo(tree, d.data.label, node => {
        node.red_process = true
        node.normal = false
        // node.predictcolor = false 
    })

    Recording.push("r:"+redNowLabel)
    console.log(Recording)


    tmpCount = 0;
    if (!isDoubleLabel(redNowLabel)){ 
        for( var i = beginLabel; i < endLabel+1; i++ ){
            var label = ""+i; //change the i to a string
            findNodeTo(tree, label, node => {
                if(node.normal){
                    if(single.check(label,redNowLabel)){
                        tmpCount ++;
                        node.predictcolor = true
                        node.normal = false
                    }
                }
            })
        }

        if(tmpCount == 0){
            alert('red wins 1')
        }
    }

    if (isDoubleLabel(redNowLabel)){ 
       
        // step1:
        tmp_redNowLabels = redNowLabel.split('/')
        for( var i = beginLabel; i < endLabel+1; i++ ){
            var label = ""+i; //change the i to a string
            findNodeTo(tree, label, node => {
                if(node.normal){
                    if(single.check(label,tmp_redNowLabels[0])){
                        tmpCount ++;
                        node.predictcolor = true
                        node.normal = false
                    }
                }
            })
        }
        if(tmpCount == 0){
            alert('red wins 2')
        }
    }
    this.run(tree)
}

function onrclick(d) {   //right click for blue player
    console.log("next:"+next)
    if (next !== 'blue') return
    // if (isDoubleLabel(d.data.label)) return
    console.log("redNowLabel:"+redNowLabel) 
    if (isDoubleLabel(redNowLabel)) { //represent that red player chose a double-labels node
       
        if(blueSelectLabel.length == 0){ 
           
            if(!d.data.predictcolor) return  
            blueSelectLabel.push(d.data.label)

            console.log(Recording)
            findNodeTo(tree, blueSelectLabel[0], node => {
                node.predictcolor = false
                node.blue = true
                node.normal = false
                tmpLayer = 0
                single.handle(blueSelectLabel[0], redNowLabel)
  
                Recording.push("b:"+d.data.label+":stop-"+tmpLayer+":")
                console.log(Recording)
            })

            // treemap.run(tree)


            for( var i = beginLabel; i < endLabel+1; i++ ){
                var label = ""+i; //change the i to a string
                findNodeTo(tree, label, node => {
                    if(node.predictcolor){
                        node.blue = false
                        node.red_process = false
                        node.red_end = false
                        node.normal = true
                        node.predictcolor = false
                    }
                })
            }

            tmpCount = 0

            for( var i = beginLabel; i < endLabel+1; i++ ){
                var label = ""+i; //change the i to a string
                findNodeTo(tree, label, node => {
                    if((node.normal||node.isDummy) && blueSelectLabel[0] != label){
                        if(double.check(blueSelectLabel[0], label, redNowLabel)){
                            tmpCount ++;
                            node.predictcolor = true
                            node.normal = false
                        }
                    }
                    
                })
            }
            treemap.run(tree)
            if(tmpCount == 0){
                alert('red wins 3')
            }
            return 

        }else{ 
            if(!d.data.predictcolor) return  

            console.log(Recording)

            for( var i = beginLabel; i < endLabel+1; i++ ){
                var label = ""+i; //change the i to a string
                findNodeTo(tree, label, node => {
                    if(node.predictcolor){
                        node.blue = false
                        node.red_process = false
                        node.red_end = false
                        node.normal = true
                        node.predictcolor = false
                    }
                })
            }
        }

    } else {  //means that red player chose a single-label leaf
        if (!checkNodeCanClick(d)) return

        for(var i = beginLabel; i < endLabel+1; i++){
            var label = ""+i; //change the i to a string
            findNodeTo(tree, label, node => {
                if(node.predictcolor){
                    node.blue = false
                    node.red_process = false
                    node.red_end = false
                    node.normal = true
                    node.predictcolor = false
                }
            })
        }
    }

    next = 'red'

    findNodeTo(tree, redNowLabel, node => {
        node.red_end = true 
        node.red_process = false
    })

    findNodeTo(tree, d.data.label, node => {
        node.blue = true
        node.normal = false
        node.predictcolor = false
    })

    if (isDoubleLabel(redNowLabel)) {
        //newcode
        FLAGPlayer = FLAGPlayer - 2
        //newcode

        tmpLayer1 = 0
        tmpLayer2 = 0

        double.handle(blueSelectLabel[0], d.data.label, redNowLabel)

        tmpstr = Recording.pop()
        // tmpstr = tmpstr.substring(0,tmpstr.length-1)
       
        //tmpLayer1+":"+
        tmpstr += (d.data.label+":stop-"+tmpLayer2)

        Recording.push(tmpstr)
        console.log(Recording)

        blueSelectLabel = []
    } else {
        //newcode
        FLAGPlayer = FLAGPlayer - 1
        tmpLayer = 0
        //newcode
        single.handle(d.data.label, redNowLabel)

        Recording.push("b:"+d.data.label+":stop-"+tmpLayer)
        console.log(Recording)
    }
    this.run(tree)
}


function findNodeTo(node, label, handle = () => {}) {  //find the node with the appointed label
    if (node.label === label || node.label.split("/")[0] == label) {
        handle(node)
        return node
    } else if (node.children.length) {
        return findNodeTo(node.children[1], label, handle) || findNodeTo(node.children[0], label, handle)
    } else {
        return    //return undefined
    }
}


function insertDummy(label){   //set dummy node
    let node = findNodeTo(tree, label)
    let d_label = label.split("/")[0]

    while (node.p && node.p.p) { //&& node.p.p || node.p
        node = node.p.p
        node.dummy.add(d_label)
        if (node.dummy.size >= 3) {
            let cds = [
                node.children[0].children[0],
                node.children[0].children[1],
                node.children[1].children[0],
                node.children[1].children[1],
            ]
            cds.forEach(i => {
                var label = i.label.split('/')[0]
                if (!node.dummy.has(label) && !i.isDummy) {
                    console.log("I become dummy: "+label)
                    turnToDummy(i)
                    showDummy(i)
                }
            })
        }
        d_label = node.label.split('/')[0]   
    }
    
}


function deleteDummy(label){   //remove dummy node

    console.log("the deleteDummy funtion begins")

    let node = findNodeTo(tree, label)
    let d_label = label //肯定是叶子节点，并且原来是红色节点
    console.log("d_label: "+d_label)
    
    while (node.p && node.p.p) {
        node = node.p.p
        console.log("the following process:" + node.label)
        sizeofDummy = node.dummy.size
        copyofnodeDummy = new Set(node.dummy)
        console.log("sizeofDummy:"+sizeofDummy)
        // node.dummy.delete(d_label.split('/')[0])
        // if(sizeofDummy >= 3)
        {
            console.log(node.label+' my dummy set elements:')
            for(var x of node.dummy){
                console.log("element :"+x)
            }
            console.log("正在考虑是否要删除的节点：" + d_label)
            {
                let cds = [
                    node.children[0].children[0],
                    node.children[0].children[1],
                    node.children[1].children[0],
                    node.children[1].children[1],
                ]
                cds.forEach(i => {
                    if(i.label.split("/")[0] == d_label.split("/")[0]){
                        console.log("谁在和d_label比较："+i.label+" "+d_label)
                        if(node.dummy.has(i.label.split("/")[0]) && (i.isLeaf || !i.isLeaf  &&  i.dummy.size == 0)){
                            console.log("谁被剔除了:"+i.label)
                            node.dummy.delete(i.label.split("/")[0])
                        }else if(!node.dummy.has(i.label.split("/")[0])){
                            console.log("不在我里边？")
                            console.log("我是："+node.label)
                            console.log("我的孙子是：")
                            for(var x of node.dummy){
                                console.log("element :"+x)
                            }
                            console.log()  
                        }else{
                            console.log("还有待分析")
                            console.log("是叶子节点吗？："+i.isLeaf)
                            console.log("dummy集合的大小？："+i.dummy.size)
                        }
                    }  
                })

                if(node.dummy.size<3){
                    for(var x of node.dummy){
                        console.log("node.dummy elements :"+x)
                    }
                    cds.forEach(i => {
                        if(!copyofnodeDummy.has(i.label.split("/")[0]) && i.isDummy){
                            console.log("I become undummy:"+ i.label)
                            turnToUnDummy(i)
                        }  
                    })
                } 
            }
        }
        d_label = node.label.split("/")[0] 
    }

    console.log("the deleteDummy funtion ends")
    console.log()
}


function showDummy(node) {
    if (!node) return
    if(node.isDummy){ //node.red != true && node.blue != true
        node.dummy_color = 'gray'
    }
    showDummy(node.children[0])
    showDummy(node.children[1])
}

function turnToDummy(node){
    if (!node) return
    node.isDummy = true
    turnToDummy(node.children[0])
    turnToDummy(node.children[1])
}

function turnToUnDummy(node){
    if (!node) return
    node.isDummy = false
    turnToUnDummy(node.children[0])
    turnToUnDummy(node.children[1])
}


//Undo button
function UndoFunction(d){
    console.log('click undo button,the undo function begins')
    if(Recording.length == 0)return
    tmpCount = 0
    var tmp = Recording.pop()
    console.log(tmp)
    var tmps = tmp.split(":");
    if(tmps.length == 2){    //"r:68"
        findNodeTo (tree, tmps[1], node => {  
            if(isDoubleLabel(tmps[1])){ 
                node.blue = true
                node.normal = false
                node.red_process = false
                node.red_end = false
                node.predictcolor = false
            }else{
                node.normal = true
                node.blue = false
                node.red_process = false
                node.red_end = false
                node.predictcolor = false 
            }
           
            deleteDummy(tmps[1])
           
            for( var i = beginLabel; i < endLabel+1; i++ ){
                var label = ""+i; //change the i to a string
                findNodeTo(tree, label, node => {
                    if(node.predictcolor){
                        node.blue = false
                        node.red_process = false
                        node.red_end = false
                        node.normal = true
                        node.predictcolor = false
                    }
                })
            }  
        })    
        FLAGPlayer = 0
        next = 'red'

    }else if(tmps.length == 3){ //"b:69/68:stop-2"
        //这个tmps实际是蓝方的策略
        //这个tmpRed仅仅是想看前一步是红色选中了哪个节点。
        var tmpRed = Recording.pop()
        var tmpRedLabel = tmpRed.split(':')[1]
        Recording.push(tmpRed)
        //找到红色节点，然后把其恢复到red_process状态
        findNodeTo (tree, tmpRedLabel, node => {  
            node.normal = false
            node.red_process = true
            node.red_end = false
            node.blue = false
            node.isDummy = false
            node.predictcolor = false
        }) 

        //找到蓝色节点，恢复到normal状态+predicting_color状态
        findNodeTo (tree, tmps[1], node => {  
            console.log('find it:'+tmps[1])
            node.blue = false
            node.label = node.label.split('/')[0]
            node.normal = true
            node.predictcolor = true  
            tmpOps = 1
            while ( tmpOps < parseInt(tmps[2].split('-')[1]) ) {
                node = node.p
                node.blue = false
                node.label = node.label.split('/')[0]
                node.normal = true
                tmpOps ++
            }
        }) 

        //还是找到这个tmpRedLabel相应的合法节点
        for( var i = beginLabel; i < endLabel+1; i++ ){
            var label = ""+i; //change the i to a string
            findNodeTo(tree, label, node => {
                if(node.normal){
                    if(single.check(label, tmpRedLabel)){
                        tmpCount ++;
                        node.predictcolor = true
                        node.normal = false
                    }
                }
            })
        }
        if(tmpCount == 0){
            alert('red wins')
        }
        FLAGPlayer = 1
        next = 'blue'
        console.log("tmps==3:"+tmps)
        console.log(Recording)
        console.log('clear finish')

    }else if(tmps.length == 4){  //"b:72/69:stop-4:"

        //这里是把所有第一次选择后的合法节点消除
        for( var i = beginLabel; i < endLabel+1; i++ ){
            var label = ""+i; //change the i to a string
            findNodeTo(tree, label, node => {
                if(node.predictcolor){
                    node.blue = false
                    node.red_process = false
                    node.red_end = false
                    node.normal = true
                    node.predictcolor = false
                }
            })
        }  
        //把第一个选择的路径节点给恢复
        findNodeTo (tree, tmps[1], node => {  
            node.blue = false
            node.normal = true
            node.label = node.label.split('/')[0]
            tmpOps = 1
            // console.log("amazing"+tmps[2])
            // console.log("you should be back:"+parseInt(tmps[2].split('-')[1]))
            //lovelove
            while ( tmpOps < parseInt(tmps[2].split('-')[1]) ) {
                node = node.p
                node.blue = false
                node.label = node.label.split('/')[0]
                node.normal = true
                tmpOps ++
            }
        })
       
        //这里不想再用redNowLabel, 这个不是最近的历史，可能出bug
        // if(redNowLabel == ""){
        //     console.log("abnormal,please check")
        //     return
        // }

        var tmpRed = Recording.pop()
        var tmpRedLabel = tmpRed.split(':')[1]
        Recording.push(tmpRed)
        
        tmp_redNowLabels = tmpRedLabel.split('/')
        
        for( var i = beginLabel; i < endLabel+1; i++ ){
            var label = ""+i; //change the i to a string
            findNodeTo(tree, label, node => {
                if(node.normal){
                    if(single.check(label,tmp_redNowLabels[0])){
                        tmpCount ++;
                        node.predictcolor = true
                        node.normal = false
                    }
                }
            })
        }

        if(tmpCount == 0){
            alert('red wins 2')
        }

        FLAGPlayer = 2
        next = 'blue'
        blueSelectLabel = []

        console.log("tmps:"+tmps) 
        console.log(Recording)

    }else if(tmps.length == 5){//b:72/69:stop-4:73/68:stop-2
       
        var tmpRed = Recording.pop()
        var tmpRedLabel = tmpRed.split(':')[1]
        Recording.push(tmpRed)

        findNodeTo (tree, tmpRedLabel, node => {  
            node.normal = false
            node.red_process = true
            node.red_end = false
        }) 
  
        findNodeTo (tree, tmps[1], node => {  
            console.log('1find it')
            node.blue = false
            node.label = node.label.split('/')[0]
            node.normal = true
            node.predictcolor = false
            tmpOps = 1
            // console.log("amazing"+tmps[2])
            // console.log("you should be back:"+parseInt(tmps[2].split('-')[1]))
            while ( tmpOps < parseInt(tmps[2].split('-')[1]) ) {
                node = node.p
                node.blue = false
                node.label = node.label.split('/')[0]
                node.normal = true
                tmpOps ++
            }
        }) 

        findNodeTo (tree, tmps[3], node => {  
            console.log('2find it')
            node.blue = false
            node.label = node.label.split('/')[0]
            node.normal = true
            node.predictcolor = false
            tmpOps = 1
            // console.log("amazing"+tmps[2])
            // console.log("you should be back:"+parseInt(tmps[2].split('-')[1]))
            while ( tmpOps < parseInt(tmps[4].split('-')[1]) ) {
                node = node.p
                node.blue = false
                node.label = node.label.split('/')[0]
                node.normal = true
                tmpOps ++
            }
        })

        FLAGPlayer = 2
        next = 'blue'
        blueSelectLabel = []

        tmp_redNowLabels = tmpRedLabel.split('/')
        for( var i = beginLabel; i < endLabel+1; i++ ){
            var label = ""+i; //change the i to a string
            findNodeTo(tree, label, node => {
                if(node.normal){
                    if(single.check(label,tmp_redNowLabels[0])){
                        tmpCount ++;
                        node.predictcolor = true
                        node.normal = false
                    }
                }
            })
        }
        if(tmpCount == 0){
            alert('redpalyer wins')
        }

        console.log(Recording)
        console.log('clear finish')
    }
    else{
        console.log("what happened?")
    }
    treemap.run(tree);

    console.log('click undo button,the undo function ends')
    console.log()
}

function newGame(){
    FLAGPlayer = 0
    location.reload()
}


const treemap = new Tree(onlclick, onrclick)  
treemap.run(tree)