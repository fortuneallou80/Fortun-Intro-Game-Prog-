let time = 0
let up = true

function update(){
    if(up){
        time++
        if(time == 255){
            up = false
        }
    } else{
        time--
        if(time == 0){
            up = true
        }
    }
}

function draw(){
    // 3 ways to specify a color
        //1. named colors like green
        //2. hex codes like #fffff
        //3. rgb 'function' like "rgb(0,255,0)"
        

    ctx.fillStyle = `rgb(0, ${time} ,0)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}