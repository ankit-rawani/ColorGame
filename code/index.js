var playername, playername2, player_mode, stop
var score = 0, score2 = 0
var highScore

var aud = new Audio("./assets/Music/Evix - Whatcha Think (feat. Jake Herring).mp3")
var click = new Audio("./assets/Music/Click.mp3")
var err = new Audio("./assets/Music/Click2.mp3")
var beep = new Audio("./assets/Music/timebeep.mp3")

const play = document.querySelector('#play')
const high = document.querySelector('#high')
const about = document.querySelector('#about')
const intro = document.querySelector('#intro')
const circle = document.querySelector('#circle')
const options = document.querySelector('#options')
const menu = document.querySelector('#menu')
const playgame = document.querySelector('#playgame')
const replay = document.querySelector('#replay')
const ham = document.querySelector('#ham') 
const back = document.querySelector('#back')
const cross = document.querySelector('#cross')
const blackout = document.querySelector('#blackout')
const msg = document.querySelector("#msg")
const crossHigh = document.querySelector("#crossHigh")

const canv = document.querySelector('#canvas1')
const canv2 = document.querySelector('#canvas2')
var ctx = canv.getContext("2d")
var ctx2 = canv2.getContext("2d")

var gamePlayState = true
var gameEnded = false

play.addEventListener("click", e => {
    stop = 0
    beep.play()
    circle.style.display = "none"
    intro.style.display = "none"
    options.style.display = "none"

    ham.style.display = "block"
    getPlayerMode()
    // replayGame()
})

function getPlayerMode(){
    hmsg.innerHTML = "<input type='radio' name='mode' id='r1' onclick='setSingle()'></input><label for='r1'>Single player</label><br/><input type='radio' name='mode' id='r2' onclick='setDual()'></input><label for='r2'>Dual player</label><br/><div id='start' onclick='getName()'>Start</div>"
    htitle.textContent = "Choose mode"

    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    let st = document.querySelector('#start')
    st.style.background = "#000000"
    st.style.color = "#ffffff"
    st.style.borderRadius = "2vw"
    st.style.width = "12vw"
    st.style.margin = "2% auto"
    blackout.style.display = "block"
    msg.style.display = "block"
    crossHigh.style.display = "block"
}

function getName(){
    if(player_mode == 1) {
        playername = prompt("Enter your name")
        confirm("Click anywhere inside the window to give upward velocity to the ball")
        if (localStorage.length == 0) {
            localStorage.setItem(playername, 0)
        }
        highScore = localStorage[localStorage.key(0)]
        replayGame()
    }
    else {
        if (window.innerWidth < 600) {
            alert("Dual player mode is available only for PC, with a keyboard for controls.")
            backToHome()
        }
        else{
            playername = prompt("Enter name of player1")
            playername2 = prompt("Enter name of player2")
            confirm("Game controls: " + playername + " should press F key and " + playername2 + " J key to give upward velocity to respective balls.")
            if (localStorage.length == 0) {
                localStorage.setItem(playername, 0)
            }
            highScore = localStorage[localStorage.key(0)]
            replayGame2()
        }
        
    }

    hideHigh()

}

function setSingle(){
    player_mode = 1
}

function setDual() {
    player_mode = 2
}

window.addEventListener('resize', e => {
    if(player_mode == 1){
        canv.height = window.innerHeight
        canv.width = window.innerWidth
    }
    else {
        canv.height = window.innerHeight
        canv.width = window.innerWidth / 2

        canv2.height = window.innerHeight
        canv2.width = window.innerWidth / 2
    }
})


window.addEventListener('keyup', e => {
    if(player_mode == 2){
        if (e.code == "KeyF") {
            click.play()
            ball.dy -= 5
            if (ball.y >= canv.height - ball.radius - 1) {
                ball.y = canv.height - ball.radius - 2
            }
        }
        if (e.code == "KeyJ") {
            click.play()
            ball2.dy -= 5
            if (ball2.y >= canv2.height - ball2.radius - 1) {
                ball2.y = canv2.height - ball2.radius - 2
            }
        }
    }    
    

    else if (e.code == "Space" && canv.style.display == "block") {    
        click.play()
        ball.dy -= 5
        if (ball.y >= canv.height - ball.radius - 1) {
            ball.y = canv.height - ball.radius - 2
        }
    }
    console.log(e)
})

canv.addEventListener('click', e=>{
    if(player_mode == 1){
        click.play()
        ball.dy -= 5
        if (ball.y >= canv.height - ball.radius - 1) {
            ball.y = canv.height - ball.radius - 2
        }
    }
})

function distance(x0, y0, x, y) {
    return Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))
}

function distanceFromLine(l,ball) {
    let side = distance(l.x1, l.y1, l.x2, l.y2)
    let z = ((l.x2 - l.x1) * (ball.x - l.x1) + (l.y2 - l.y1) * (ball.y - l.y1)) / side
    let a = distance(ball.x, ball.y, l.x1, l.y1)

    // console.log(a, z)
    if(z <= side && z>=0)
    { 
        return Math.sqrt( a * a - z * z)
    }
    else {
        return 2 * ball.radius
    }
}

function Ball(x, y, dx, dy, radius, color, c, index){
    this.radius = radius
    this.x = x
    this.y = y
    this.color = color
    this.dy = dy
    this.dx = dx
    this.ctx = c
    this.index = index

    this.draw = function(){
        this.ctx.restore()
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false)
        this.ctx.fillStyle = this.color
        this.ctx.fill()
        this.ctx.closePath()
    }

    this.move = function(){
        if(this.y >= canv.height - this.radius-1){
            this.dy = -this.dy*0.9
        }
        else{
            this.dy += 0.2   
        }

        this.y += this.dy
        this.draw()
    }
    
}

function Line(x1, y1, x2, y2, color, c) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.color = color
    this.ctx = c

    this.draw = function () {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.strokeStyle = this.color
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()
        this.ctx.closePath()
    }
}

function Arc(centre, radius, sAngle, eAngle, color, c){
    this.centre = centre
    this.radius = radius
    this.color = color
    this.sAngle = sAngle
    this.eAngle = eAngle
    this.ctx = c

    this.draw = function(){
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.color
        this.ctx.arc(this.centre.x, this.centre.y, this.radius, this.sAngle, this.eAngle)
        this.ctx.stroke()
        this.ctx.closePath()
    }

}

function ColorSwitch(pos, vel, bl, c) {
    this.vel = vel
    this.pos = pos
    this.radius = 10
    this.color
    this.colorArr = ["#ff0000", "#00ff00", "#0000ff"]
    this.circle
    this.i = 0
    this.ball = bl
    this.ctx = c

    this.draw = function(){
        this.i++

        if(this.i%60 == 0){
            this.color = this.colorArr[Math.floor(Math.random() * this.colorArr.length)]
        }

        this.circle = new Arc(this.pos, this.radius, 0, Math.PI * 2, this.color, this.ctx)
        this.circle.draw()
    }

    this.move = function() {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        if(this.ball.y <= this.pos.y+5 && this.ball.y >=this.pos.y - 5){
            this.ball.color = this.colorArr[Math.floor(Math.random() * this.colorArr.length)]
        }
        
        this.draw()
    }

}

function gameEnd(){
    err.play()
    
    if (player_mode == 1) {
        if (highScore < score) {
            localStorage.clear()
            localStorage.setItem(playername, score)
        }
        gameEnded = true
        gamePlayState = false
        console.log("done")
        window.cancelAnimationFrame(window.x)
        ctx.clearRect(0, 0, canv.width, canv.height)
        htitle.textContent = "GAME OVER!!!"
        hmsg.textContent = "Try again, all you need is a little practice."
        
        let btn = document.createElement('div')
        btn.textContent = "Play again"
        btn.style.background = "#000000"
        btn.style.color = "#ffffff"
        btn.style.textAlign = "center"
        btn.style.fontSize = "2vw"

        btn.addEventListener('click', e => {
            playAgain()
        })

        msg.appendChild(htitle)
        msg.appendChild(hmsg)
        msg.appendChild(btn)
        btn.style.width = "13vw"
        btn.style.margin = "2% auto"
        blackout.style.display = "block"
        msg.style.display = "block"
        crossHigh.style.display = "block"
    }
    else {

        if(score>score2){
            if (highScore < score) {
                localStorage.clear()
                localStorage.setItem(playername, score)
            }
        }
        else {
            if (highScore < score2) {
                localStorage.clear()
                localStorage.setItem(playername2, score2)
            }
        }
        
        gameEnd2()
    }
    
}

function Triangle(centre, side, velocity, bl, c){
    this.centre = centre
    this.side = side
    this.velocity = velocity
    this.angle = 0
    this.radVelocity = 0.05
    this.p1 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle), y: (side / Math.sqrt(3)) * Math.sin(this.angle) }
    this.p2 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (2 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (2 / 3) * Math.PI) }
    this.p3 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (4 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (4 / 3) * Math.PI) }
    this.ball = bl
    this.line1
    this.line2
    this.line3
    this.ctx = c

    this.draw = function(){
        this.line1 = new Line(
            this.centre.x + this.p1.x, this.centre.y + this.p1.y,
            this.centre.x + this.p2.x, this.centre.y + this.p2.y,
            "#ff0000",
            this.ctx
        )

        this.line1.draw()

        this.line2 = new Line(
            this.centre.x + this.p2.x, this.centre.y + this.p2.y,
            this.centre.x + this.p3.x, this.centre.y + this.p3.y,
            "#00ff00", this.ctx
        )

        this.line2.draw()

        this.line3 = new Line(
            this.centre.x + this.p3.x, this.centre.y + this.p3.y,
            this.centre.x + this.p1.x, this.centre.y + this.p1.y,
            "#0000ff", this.ctx
        )

        this.line3.draw()
    }

    this.move = function(){
        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y
        this.rotate()

    }

    this.end = function() {
        if (distanceFromLine(this.line1, this.ball) <= this.ball.radius && this.line1.color != this.ball.color) {
            // console.log(distanceFromLine(this.line1, ball))
            stop = stop+this.ball.index
            gameEnd()
        }

        if (distanceFromLine(this.line2, this.ball) <= this.ball.radius && this.line2.color != this.ball.color) {
            // console.log(distanceFromLine(this.line2, ball))
            stop = stop+this.ball.index
            gameEnd()
        }

        if (distanceFromLine(this.line3, this.ball) <= this.ball.radius && this.line3.color != this.ball.color) {
            // console.log(distanceFromLine(this.line3, ball))
            stop = stop+this.ball.index
            gameEnd()
        }
    }

    this.rotate = function () {
        this.angle += this.radVelocity
        this.p1 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle), y: (side / Math.sqrt(3)) * Math.sin(this.angle) }
        this.p2 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (2 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (2 / 3) * Math.PI) }
        this.p3 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (4 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (4 / 3) * Math.PI) }
        this.draw()        
    }

}

function Circle(centre, radius, velocity, bl, c){
    this.centre = centre
    this.radius = radius
    this.velocity = velocity
    this.colorArray = ["#ff0000", "#00ff00","#0000ff"]
    this.arc1
    this.arc2
    this.arc3
    this.angle = 0
    this.radVelocity = 0.05
    this.ball = bl
    this.ctx = c

    this.draw = function(){
        this.arc1 = new Arc(this.centre, this.radius, this.angle, this.angle + (2 / 3) * Math.PI, this.colorArray[0], this.ctx)
        this.arc1.draw()
        this.arc2 = new Arc(this.centre, this.radius, this.angle + (2 / 3) * Math.PI, this.angle + (4 / 3) * Math.PI, this.colorArray[1], this.ctx)
        this.arc2.draw()
        this.arc3 = new Arc(this.centre, this.radius, this.angle + (4 / 3) * Math.PI, this.angle + 2 * Math.PI, this.colorArray[2], this.ctx)
        this.arc3.draw()
    }

    this.rotate = function(){
        this.angle += this.radVelocity
        this.draw()
    }

    this.move = function () {
        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y
        this.rotate()
    }

    this.end = function() {
        if ((distance(this.centre.x, this.centre.y, this.ball.x, this.ball.y) <= this.ball.radius + this.radius + 5) && distance(this.centre.x, this.centre.y, this.ball.x, this.ball.y) >= this.ball.radius + this.radius - 5) {
            let ang
            if (this.ball.y > this.centre.y) {
                ang = (this.angle - Math.PI / 2) % (2 * Math.PI)
    
            }
            else {
                ang = (this.angle + Math.PI / 2) % (2 * Math.PI)
            }

            if (ang > 0 && ang <= (2 / 3) * Math.PI) {
                console.log("blue")
                if (this.ball.color != this.colorArray[2]) {
                    stop = stop+this.ball.index
                    gameEnd()
                }
            }
            else if (ang > (2 / 3) * Math.PI && ang <= (4 / 3) * Math.PI) {
                console.log("green")
                if (this.ball.color != this.colorArray[1]) {
                    stop = stop+this.ball.index
                    gameEnd()
                }
            }
            else {
                console.log('red')
                if (this.ball.color != this.colorArray[0]) {
                    stop = stop+this.ball.index
                    gameEnd()
                }
            }
        }
    }
}

function Fan(centre, radius, velocity, bl, c) {
    this.centre = centre
    this.radius = radius
    this.velocity = velocity
    this.colorArray = ["#ff0000", "#00ff00", "#0000ff"]
    this.angle = 0
    this.radVelocity = 0.05
    this.line1
    this.line2
    this.line3
    this.ball = bl
    this.ctx = c
    this.p1 = { x: this.radius * Math.cos(this.angle), y: this.radius * Math.sin(this.angle) }
    this.p2 = { x: this.radius * Math.cos(this.angle + (2 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (2 / 3) * Math.PI) }
    this.p3 = { x: this.radius * Math.cos(this.angle + (4 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (4 / 3) * Math.PI) }

    this.draw = function() {
        this.line1 = new Line(this.centre.x, this.centre.y, this.centre.x + this.p1.x, this.centre.y + this.p1.y, colorArray[0], this.ctx)
        this.line1.draw()

        this.line2 = new Line(this.centre.x, this.centre.y, this.centre.x + this.p2.x, this.centre.y + this.p2.y, colorArray[1], this.ctx)
        this.line2.draw()

        this.line3 = new Line(this.centre.x, this.centre.y, this.centre.x + this.p3.x, this.centre.y + this.p3.y, colorArray[2], this.ctx)
        this.line3.draw()
    }

    this.rotate = function() {
        this.angle += this.radVelocity
        this.p1 = { x: this.radius * Math.cos(this.angle), y: this.radius * Math.sin(this.angle) }
        this.p2 = { x: this.radius * Math.cos(this.angle + (2 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (2 / 3) * Math.PI) }
        this.p3 = { x: this.radius * Math.cos(this.angle + (4 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (4 / 3) * Math.PI) }
        this.draw()
    }

    this.move = function() {
        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y

        this.rotate()
    }

    this.end = function() {
            if (distanceFromLine(this.line1, this.ball) <= this.ball.radius && this.line1.color != this.ball.color) {
                // console.log(distanceFromLine(this.line1, ball))
                stop = stop+this.ball.index
                gameEnd()
            }

            if (distanceFromLine(this.line2, this.ball) <= this.ball.radius && this.line2.color != this.ball.color) {
                // console.log(distanceFromLine(this.line2, ball))
                stop = stop+this.ball.index
                gameEnd()
            }

            if (distanceFromLine(this.line3, this.ball) <= this.ball.radius && this.line3.color != this.ball.color) {
                // console.log(distanceFromLine(this.line3, ball))
                stop = stop+this.ball.index
                gameEnd()
            }
    }


}

function func(a, b) {
    return Math.random() - 0.5
}

var v, y_array, c1, c2, c3, ball, obstacles, tri, cir, fan, pS, swt
var c12, c22, c32, ball2, obstacles2, tri2, cir2, fan2, pS2, swt2
var colorArray = ["#ff0000","#00ff00","#0000ff"]

function animate() {
    window.x = window.requestAnimationFrame(animate)
    ctx.fillStyle = "#123456"
    ctx.fillRect(0, 0, canv.width, canv.height)
    
    if(player_mode == 1){
        if (score > 2000) {
            gameWon()
        }
    }
    
    if(stop!=1 && stop!=3){
        ball.move()
        if (ball.y <= 3 * canv.height / 4) {
            obstacles.forEach(obs => {
                obs.move()
                obs.end()
            })


            swt.move()
            ctx.font = "20px 'Open-sans', sans-serif"
            ctx.fillStyle = "#ffffff"
            ctx.fillText(playername + " " + score, canv.width - 150, 30)
            score += v.y
        }
        else {
            obstacles.forEach(obs => {
                obs.rotate()
                obs.end()
                ctx.fillStyle = "#ffffff"
                ctx.fillText(playername + " " + score, canv.width - 150, 30)
            })
            swt.draw()
        }
    }
    else{
        ctx.fillStyle = "#123456"
        ctx.fillRect(0, 0, canv.width, canv.height)
    }
    
    
    if(player_mode==2){
        ctx2.fillStyle = "#654321"
        ctx2.fillRect(0, 0, canv2.width, canv2.height)
        if(stop!=3 && stop!=2){
            ball2.move()
            if (ball2.y <= 3 * canv2.height / 4) {
                obstacles2.forEach(obs => {
                    obs.move()
                    obs.end()
                })


                swt2.move()
                ctx2.font = "20px 'Open-sans', sans-serif"
                ctx2.fillStyle = "#ffffff"
                ctx2.fillText(playername2 + " " + score2, canv2.width - 150, 30)
                score2 += v.y
            }
            else {
                obstacles2.forEach(obs => {
                    obs.rotate()
                    obs.end()
                    ctx2.fillStyle = "#ffffff"
                    ctx2.fillText(playername2 + " " + score2, canv2.width - 150, 30)
                })
                swt2.draw()
            }
        }
        else{
            ctx2.fillStyle = "#654321"
            ctx2.fillRect(0, 0, canv2.width, canv2.height)
        }
        
    }

}

ham.addEventListener("click", pauseGame)
back.addEventListener("click", backToHome)
cross.addEventListener("click", playGame)
replay.addEventListener("click", playAgain)
playgame.addEventListener("click", playGame)

function playAgain(){
    stop = 0
    hideHigh()
    if(player_mode == 1){
        replayGame()
    }
    else{
        replayGame2()
    }
}

function pauseGame(){
    beep.play()
    window.cancelAnimationFrame(window.x)
    menu.style.display = "inline-block"
    ham.style.display = "none"
    gamePlayState = false
}

function playGame(){
    beep.play()
    if(!gamePlayState && !gameEnded){
        ham.style.display = "inline-block"
        menu.style.display = "none"
        window.x = window.requestAnimationFrame(animate)
        gamePlayState = true
    }
}

function replayGame(){
    hideHigh()
    gamePlayState = true
    gameEnded = false
    beep.play()

    canv.height = window.innerHeight
    canv.width = window.innerWidth

    ctx.lineWidth = 10
    ctx.lineCap = "round"

    canv.style.display = "block"

    score = 0
    highScore = localStorage[localStorage.key(0)]
    ctx.lineWidth = 10
    ctx.lineCap = "round"
    window.cancelAnimationFrame(window.x)
    ham.style.display = "inline-block"
    menu.style.display = "none"
    
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    obstacles = []
    v = { x: 0, y: 3 }
    y_array = [-100, -700, -1300]

    y_array.sort(func)

    c1 = { x: canv.width / 2, y: y_array[0] }
    s1 = 200

    c2 = { x: canv.width / 2, y: y_array[1] }
    s2 = 100

    c3 = { x: canv.width / 2 - 40, y: y_array[2] }
    s3 = 100

    ball = new Ball(canv.width / 2, canv.height / 2, 0, 2, 5, colorArray[Math.floor(Math.random() * 3)], ctx, 1)
    tri = new Triangle(c1, s1, v, ball, ctx)
    cir = new Circle(c2, s2, v, ball, ctx)
    fan = new Fan(c3, s3, v, ball, ctx)

    obstacles.push(tri)
    obstacles.push(cir)
    obstacles.push(fan)

    pS = { x: canv.width / 2, y: -1000 }
    swt = new ColorSwitch(pS, v, ball, ctx)

    animate()

}

function replayGame2() {
    hideHigh()
    gamePlayState = true
    gameEnded = false
    beep.play()

    score = 0
    score2 = 0
    highScore = localStorage[localStorage.key(0)]

    canv.style.display = "inline"
    canv2.style.display = "inline"
   
    window.cancelAnimationFrame(window.x)
    ham.style.display = "inline-block"
    menu.style.display = "none"

    canv.width = window.innerWidth/2
    canv2.width = window.innerWidth/2

    canv.height = window.innerHeight
    canv2.height = window.innerHeight

    ctx.clearRect(0, 0, innerWidth, innerHeight)
    ctx2.clearRect(0, 0, innerWidth, innerHeight)

    ctx.lineWidth = 10
    ctx.lineCap = "round"
    ctx2.lineWidth = 10
    ctx2.lineCap = "round"

    obstacles = []
    v = { x: 0, y: 3 }
    y_array = [-100, -700, -1300]

    y_array.sort(func)

    c1 = { x: canv.width / 2, y: y_array[0] }
    s1 = 200

    c2 = { x: canv.width / 2, y: y_array[1] }
    s2 = 100

    c3 = { x: canv.width / 2 - 40, y: y_array[2] }
    s3 = 100

    ball = new Ball(canv.width / 2, canv.height / 2, 0, 2, 5, colorArray[Math.floor(Math.random() * 3)], ctx, 1)
    tri = new Triangle(c1, s1, v, ball, ctx)
    cir = new Circle(c2, s2, v, ball, ctx)
    fan = new Fan(c3, s3, v, ball, ctx)

    obstacles.push(tri)
    obstacles.push(cir)
    obstacles.push(fan)

    pS = { x: canv.width / 2, y: -1000 }
    swt = new ColorSwitch(pS, v, ball, ctx)

    obstacles2 = []

    c12 = { x: canv2.width / 2, y: y_array[0] }
    s12 = 200

    c22 = { x: canv2.width / 2, y: y_array[1] }
    s22 = 100

    c32 = { x: canv2.width / 2 - 40, y: y_array[2] }
    s32 = 100

    ball2 = new Ball(canv2.width / 2, canv2.height / 2, 0, 2, 5, colorArray[Math.floor(Math.random() * 3)], ctx2, 2)
    tri2 = new Triangle(c12, s12, v, ball2, ctx2)
    cir2 = new Circle(c22, s22, v, ball2, ctx2)
    fan2 = new Fan(c32, s32, v, ball2, ctx2)

    obstacles2.push(tri2)
    obstacles2.push(cir2)
    obstacles2.push(fan2)

    pS2 = { x: canv2.width / 2, y: -1000 }
    swt2 = new ColorSwitch(pS2, v, ball2, ctx2)

    animate()

}

function backToHome(){
    canv.style.display = "none"
    canv2.style.display = "none"
    circle.style.display = "block"
    intro.style.display = "block"
    options.style.display = "flex"
    menu.style.display = "none"

    ham.style.display = "none"

}

high.addEventListener("click", showHigh)
crossHigh.addEventListener("click", hideHigh)

var hmsg = document.createElement('p')
hmsg.style.fontSize = "2vw"
hmsg.style.textAlign = "center"

var htitle = document.createElement('div')
htitle.style.fontSize = "6vw"
htitle.style.textAlign = "center"
htitle.style.fontFamily = "'Chewy', cursive"

function showHigh(){
    aud.play()
    hmsg.textContent = localStorage.key(0) + " : " + localStorage[localStorage.key(0)]
    htitle.textContent = "Our Highest Scorer"
    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    blackout.style.display = "block"
    msg.style.display = "block"
    crossHigh.style.display = "block"
}

function hideHigh(){
    aud.pause()
    beep.play()
    while(msg.firstChild){
        msg.removeChild(msg.firstChild)
    }

    blackout.style.display = "none"
    msg.style.display = "none"
    crossHigh.style.display = "none"
}

about.addEventListener("click", showAbout)

function showAbout() {
    aud.play()
    htitle.textContent = "About"
    hmsg.innerHTML = "This is a game made as a task for the Inductions of Delta Club of NITT.<br/><br/>For better experience, play on PC.<br/><br/>Made by Ankit Rawani <br/>GitHub ID : <a href='https://github.com/ankit-rawani'><b>ankit-rawani</b></a>"
    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    blackout.style.display = "block"
    msg.style.display = "block"
    crossHigh.style.display = "block"
}

function gameWon(){
    aud.play()
    gameEnded = true
    gamePlayState = false
    console.log("done")
    window.cancelAnimationFrame(window.x)
    ctx.clearRect(0, 0, canv.width, canv.height)
    htitle.textContent = "You Won!!!"
    hmsg.textContent = "Congatulations! You completed the game."

    let btn = document.createElement('div')
    btn.textContent = "Play again"
    btn.style.background = "#000000"
    btn.style.color = "#ffffff"
    btn.style.textAlign = "center"
    btn.style.fontSize = "2vw"

    btn.addEventListener('click', e => {
        playAgain()
    })

    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    msg.appendChild(btn)
    btn.style.width = "13vw"
    btn.style.margin = "2% auto"

    blackout.style.display = "block" 

    msg.style.display = "block"
    crossHigh.style.display = "block"
}

function gameEnd2(){
    if(stop == 3) {
        aud.play()
        gameEnded = true
        gamePlayState = false
        console.log("done")
        window.cancelAnimationFrame(window.x)
        htitle.textContent = "Results"

        if(score>score2){
            hmsg.textContent = playername+" won!!"
        }
        else if(score == score2){
            hmsg.textContent = "Its a tie!!"
        }
        else {
            hmsg.textContent = playername2 + " won!!"
        }

        let btn = document.createElement('div')
        btn.textContent = "Play again"
        btn.style.background = "#000000"
        btn.style.color = "#ffffff"
        btn.style.fontSize = "2vw"
        btn.style.textAlign = "center"
        
        btn.addEventListener('click', e=>{
            playAgain()
        })

        msg.appendChild(htitle)
        msg.appendChild(hmsg)
        msg.appendChild(btn)
        btn.style.width = "13vw"
        btn.style.margin = "2% auto"
        blackout.style.display = "block"
        msg.style.display = "block"
        crossHigh.style.display = "block"
    }
}