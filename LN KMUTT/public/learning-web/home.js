async function cpy(){
    console.log("Thai");
    const response = await fetch("http://localhost:3001/setcourse?course="+"Thai"+"&username="+document.cookie.split("=")[2])
}

async function wpy(){
    console.log("Eng");
    const response = await fetch("http://localhost:3001/setcourse?course="+"Eng"+"&username="+document.cookie.split("=")[2])
}

async function mpy(){
    console.log("Math");
    const response = await fetch("http://localhost:3001/setcourse?course="+"Math"+"&username="+document.cookie.split("=")[2])
}