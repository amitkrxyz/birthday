const daysText = document.querySelector("#days")
const timeText = document.querySelector("#time")
const title = document.querySelector("title")
let dob = new Date("1 oct 2004")
let nextBday;
let nowDate = new Date;

async function updateQuote() {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json()
    console.log(data)
    document.getElementById("quote").textContent = data.content
    document.querySelector("#author").textContent = `- ${data.author}`
    console.log(data.content, data.author)
}
updateQuote()

const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse

const engine = Engine.create(),
    world = engine.world;
// engine.gravity.scale = 0.001


const width = window.innerWidth
const height = window.innerHeight
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
    }
})
// setting canvas width and height
render.canvas.width = width
render.canvas.height = height

const MAX = 100
const SIZE = Math.sqrt(width * height / ((MAX + (MAX / 10)) * 10) * Math.PI)
const BOXSIZE = SIZE * 2

// creating walls
const topWall = Bodies.rectangle(window.innerWidth / 2, 0 - BOXSIZE - 2 * SIZE, window.innerWidth + BOXSIZE, BOXSIZE, { isStatic: true })
const bottomWall = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + BOXSIZE / 2, window.innerWidth + BOXSIZE, BOXSIZE, { isStatic: true })
const leftWall = Bodies.rectangle(0 - BOXSIZE / 2, window.innerHeight / 2, BOXSIZE, window.innerHeight + BOXSIZE, { isStatic: true })
const rightWall = Bodies.rectangle(window.innerWidth + BOXSIZE / 2, window.innerHeight / 2, BOXSIZE, window.innerHeight + BOXSIZE, { isStatic: true })

// add mouse control
const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            render: {
                visible: false
            }
        }
    });

Composite.add(world, [bottomWall, leftWall, rightWall, topWall, mouseConstraint])

// Updating texts
setInterval(() => {
    const nowDate = new Date()
    let time;
    let days
    if (dob.getDate() == nowDate.getDate() && dob.getMonth() === nowDate.getMonth()) {
        const text = "Happy Birthday:)"
        document.getElementById("text").textContent = text
        title.textContent = text
    } else {
        if (
            (dob.getDate() > nowDate.getDate() && dob.getMonth() < nowDate.getMonth()) ||
            (dob.getDate() < nowDate.getDate() && dob.getMonth() <= nowDate.getMonth())
            ) {
            nextBday = new Date(`${dob.getMonth() + 1}/${dob.getDate()}/${nowDate.getFullYear() + 1}`)
        } else if (
            (dob.getDate() < nowDate.getDate() && dob.getMonth() > nowDate.getMonth()) ||
            (dob.getDate() > nowDate.getDate() && dob.getMonth() >= nowDate.getMonth())
        ) {
            console.log("second condition activated")
            nextBday = new Date(`${dob.getMonth() + 1}/${dob.getDate()}/${nowDate.getFullYear()}`)
        }
        // console.log(nextBday)
        const remTime = getDuration(nextBday - new Date)
        time = `${addZeros(remTime.hours)}:${addZeros(remTime.minutes)}:${addZeros(remTime.seconds)}`
        days = `${addZeros(remTime.days)} Days`
        daysText.textContent = days
        timeText.textContent = time
        if (remTime.days <= 0) {
            title.textContent = time
        } else {
            title.textContent = days
        }
    }
}, 500);


// Adding initial boxes
let n = nowDate.getFullYear() - dob.getFullYear()
setInterval(() => {
    n = nowDate.getFullYear() - dob.getFullYear()
    const totalBody = n + 4 // n + all 4 walls
    if (world.bodies.length < totalBody) {
        addBox()
    }
    document.querySelector(".time")
    for (let i = 0; i < world.bodies.length; i++) {
        const box = world.bodies[i]
        if (box.position.y > window.innerHeight + BOXSIZE ||
            box.position.y < 0 - BOXSIZE ||
            box.position.x > window.innerWidth + BOXSIZE ||
            box.position.x < 0 - SIZE * 16) {
                Composite.remove(engine.world, box)
        }
    }
}, 1000 / Math.sqrt(n))

// Animating container
setTimeout(() => {
    const container = document.querySelector(".container")
    container.style.opacity = 1
    if (typeof window !== 'undefined') {
        window.addEventListener('deviceorientation', updateGravity);
    }
}, 2000)


Render.run(render)
const runner = Runner.create()
Runner.run(runner, engine)

function addBox() {
    const box = Bodies.polygon(Common.random(0, window.innerWidth), 0 - SIZE, Math.round(Common.random(2, 8)), SIZE, { restitution: 0.8, friction: 0.8 })
    Composite.add(engine.world, [box])
}

function addZeros(n) {
    let result = `${n}`
    if (result.length > 1) return result;
    return `0${result}`
}

function updateGravity(event) {
    if (event.alpha || event.beta || event.gamma) {
        let orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
            gravity = engine.gravity;

            if (orientation === 0) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(event.beta, -90, 90) / 90;
        } else if (orientation === 180) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
        } else if (orientation === 90) {
            gravity.x = Common.clamp(event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
        } else if (orientation === -90) {
            gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
        }
    }
}

function getDuration(milli) {
    const days = Math.floor(milli / 86400000);
    milli -= days * 86400000;
    const hours = Math.floor(milli / 3600000);
    milli -= hours * 3600000;
    const minutes = Math.floor(milli / 60000);
    milli -= minutes * 60000;
    const seconds = Math.round(milli / 1000);
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
};
console.log("Made with 🫀 by Amit")