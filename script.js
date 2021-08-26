const input = document.getElementById("input");
const table = document.getElementById("tabla");
const boton = document.getElementById("boton");
const form = document.getElementById("form");
const screenbtn = document.getElementById("startFull");
let tareas = [];

function agregarTarea() {
  const fila = document.createElement("tr");
  fila.innerHTML = `
                    <td> <input type="checkbox" id="chk" onClick="completar()" /> </td>
                    <td style="flex-grow: 2" >${input.value}</td>               
                    <td> <span onClick="borrar()" class="fas fa-trash" >  </span> </td>
                    `;
  tabla.appendChild(fila);
}


boton.addEventListener("click", function (e) {
  if (input.value === "") {
    validacion("No puedes agregar una tarea vacía", "fallo");
  } else {
    agregarTarea();
  }
  form.reset();
});


function borrar(event) {
  texto = this.event.target.parentElement.parentElement.children[1].innerHTML;
  this.event.target.parentElement.parentElement.remove();
}


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


function completar(event) {
  if (this.event.target.checked) {
    this.event.target.parentElement.parentElement.children[0].classList.add("completado");
    this.event.target.parentElement.parentElement.children[1].classList.add("completado");
  } else {
    this.event.target.parentElement.parentElement.children[1].classList.remove(
      "completado"
    );
    this.event.target.parentElement.parentElement.children[0].classList.remove(
      "completado"
    );
  }
}