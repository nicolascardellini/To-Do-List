const input = document.getElementById("input");
const table = document.getElementById("tabla");
const boton = document.getElementById("boton");
const form = document.getElementById("form");
const screenbtn = document.getElementById("startFull");
let tareas = [];

//Add tasks
function agregarTarea() {
  const fila = document.createElement("tr");
  fila.innerHTML = `
                    <td> <input type="checkbox" id="chk" onClick="completar()" /> </td>
                    <td style="flex-grow: 2" >${input.value}</td>
                    <td> <span onClick="copiarTarea()" class="far fa-clipboard" > </span> </td>               
                    <td> <span onClick="share()" class="fas fa-share-alt" > </span> </td>
                    <td> <span onClick="borrar()" class="fas fa-trash" >  </span> </td>
                    `;
  table.prepend(fila);
}

//Comportamiento del boton para agregar
boton.addEventListener("click", function (e) {
  if (input.value === "") {
    validacion("No puedes agregar una tarea vacía", "fallo");
  } else {
    agregarTarea();
    agregarItem(input.value);
    guardarLocalStorage();
  }
  form.reset();
});

//Delete tasks
function borrar(event) {
  this.event.target.parentElement.parentElement.remove();
  eliminarLocalStorage(copiarText(event));
}

//Empty task error mensaje
function validacion(mensaje, clase) {
  const div = document.createElement("div");
  div.className = clase;
  div.appendChild(document.createTextNode(mensaje));
  
  const titulo = document.querySelector("h1");
  titulo.insertBefore(div, null);

  setTimeout(function () {
    document.querySelector(`.${clase}`).remove();
  }, 3000);
}


//Mark tasks done
function completar(event) {
  tareas = JSON.parse(localStorage.getItem('tarea'));
  if (this.event.target.checked) {
    
    this.event.target.parentElement.parentElement.children[0].classList.add("completado");
    this.event.target.parentElement.parentElement.children[1].classList.add("completado");
    completarLocalStorage(copiarText(event));
  } else {
    this.event.target.parentElement.parentElement.children[1].classList.remove(
      "completado"
    );

    this.event.target.parentElement.parentElement.children[0].classList.remove(
      "completado"
    );
    completarLocalStorage(copiarText(event));
  }
}

//Copy text for elements
function copiarText(event){
  return this.event.target.parentElement.parentElement.children[1].innerHTML;
}

//Share tasks
function share() {
  if (!("share" in navigator)) {
    alert('Share no es soportado.');
    return;
  }

  navigator.share({
      title: "Esta es la tarea compartida",
      text: copiarText(onclick),
      url: document.URL
    })
    .then(() => console.log('Successful share'))
    .catch(error => console.log('Error sharing:', error));
}

//Full Screen
screenbtn.addEventListener("click", function(event){ 
  if(document.fullscreenElement == null){
    document.documentElement.requestFullscreen();
    screenbtn.className ="fas fa-compress";
  }
  else{
    document.exitFullscreen();
    screenbtn.className ="fas fa-expand";
  }
});

//Copy Tasks
function copiarTarea(){
  if(navigator.clipboard != undefined){
    navigator.clipboard.writeText(copiarText(onclick))
    .then(() => log("Tarea copiada"))
    .catch(err => console.error("Error: ", err));
  }
}

//Save Elements Offline

const agregarItem = async (tarea) => {

  let item = {
    tarea: tarea,
    estado: false,
    geo: await obtenerUbicacion()
  }
  tareas.unshift(item);
}

const guardarLocalStorage = () => {
  localStorage.setItem('tarea', JSON.stringify(tareas));
}

const cargarLocalStorage = () => {
  table.innerHTML = '';
  tareas = JSON.parse(localStorage.getItem('tarea'));
  if(tareas === null){
    tareas = [];
  }else{
    
    tareas.forEach(element => {
      if(element.estado == true){
        table.innerHTML += `
      <td class="completado"> <input type="checkbox" id="chk" onClick="completar()" checked="checked" /> </td>
      <td style="flex-grow: 2" class="completado" >${element.tarea}</td>
      <td> <span onClick="copiarTarea()" class="far fa-clipboard" > </span> </td>               
      <td> <span onClick="share()" class="fas fa-share-alt" > </span> </td>
      <td> <span onClick="borrar()" class="fas fa-trash" >  </span> </td>
      `;
      }
      else{
      table.innerHTML += `
      <td> <input type="checkbox" id="chk" onClick="completar()" /> </td>
      <td style="flex-grow: 2" >${element.tarea}</td>
      <td> <span onClick="copiarTarea()" class="far fa-clipboard" > </span> </td>               
      <td> <span onClick="share()" class="fas fa-share-alt" > </span> </td>
      <td> <span onClick="borrar()" class="fas fa-trash" >  </span> </td>
      `;
      }
    });
  }
}

eliminarLocalStorage = (tarea1) => {
  let indexA;
  tareas.forEach((element, index) => {
    if(element.tarea === tarea1){
      indexA = index;
    }
  });
  
  tareas.splice(indexA,1);
  guardarLocalStorage();
}

completarLocalStorage = (tarea) => {
  tareas.forEach((element, index) => {
    if(element.tarea === tarea){
      if(element.estado == false){
        element.estado = true;
      }
      else{
        element.estado = false;
      }
    }
  });
  guardarLocalStorage();
}

//Geolocation Tasks
const obtenerUbicacion = async() => {
  let geo = {
    lat: null,
    lon: null,
  };


    const promesa = new Promise((resolve, reject) =>{
    navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const pos = await promesa;
    geo.lat = pos.coords.latitude;
    geo.lon = pos.coords.longitude;
    return geo;
}

window.onload = function (){
  cargarLocalStorage();
}
