var chat = "";

var necesitaCita = false;
var necesitaCita2 = "";

var nombre = "";
var nombreEsta = false;
var apellidos = "";
var apellidosEsta = false;

var contDatos = 0;

const db = firebase.firestore();

const taskForm = document.getElementById("task-form2");

const saveUser = (Name, LastName, ID, Entity, URL) =>
  db.collection("usuarios").doc().set({
    Name,
    LastName,
    ID,
    Entity,
    URL,
  });

const getUsers = () => db.collection("usuarios").get();

//crear metodo que analice lo que se esta escribiendo depende de eso se envia o se consulta

/**
 * metodo que se encarga de procesar las palabras que se van a enviar
 */
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("as");

  //const description= taskForm['task-description'];

  //await saveUser("juan2","2","1235","Muerte","url")
  //title.reset();

  //pruebas de consumo a get

  const querySnapshot = await getUsers();
  querySnapshot.forEach(doc => {
    console.log(doc.data())
    addNamePatient(doc.data())
  });
  console.log("fin");

  //procesar palabra

  const texto = document.getElementById("message");
  console.log(texto.value);
  //procesarTexto(texto.value);


    createMensajeUser("user", texto.value, "01/01/2021");
    createMensajeSystem("system", procesarTexto(texto.value), "01/01/2021");
  
  


});


function addNamePatient(objetoPatient) {
  NamePatient
  var padre = document.getElementById("NamePatient");
  var option1 = document.createElement("option");
  //option1.setAttribute("class", "direct-chat-name float-left");
  option1.textContent = objetoPatient.Name;
  padre.appendChild(option1);
}


function procesarTexto(texto) {
  syncDelay(110);
  if (texto.toUpperCase() == "HOLA") {
    chat = "Hola, si desea pedir una cita escriba: cita";
    return chat;
  } else if (texto.toUpperCase() == "CITA") {
    necesitaCita = true;
    chat = "Es necesario que llene un formulario, escriba ok para continuar";
    necesitaCita2 = "ok";
    necesitaCita = true;
    return chat;
  }
  if(necesitaCita){
    //return procesarDatosUsuario(texto)
    if(this.nombre == "" & !this.nombreEsta){
      chat = "¿cuál es su nombre?";
      nombreEsta = true;
      this.contDatos = 1;
      return chat;
    }else if(this.contDatos == 1){
      this.nombre =texto;
      if(this.apellidos == ""){
        chat = "¿Cuál es su apellido?"
        return chat;
      }
    }
    
    
  }
  
  else {
    return "No te entiendo";
  }
  console.log(texto);
}



function procesarDatosUsuario(usuertext) {
  if(!nombreEsta){
    nombreEsta = true;
    return "Cuál es su nombre?";
   }
  else if(!apellidosEsta){
    this.nombre = usuertext;

  }
   
   
 };


function syncDelay(milliseconds) {
  var start = new Date().getTime();
  var end = 0;
  while (end - start < milliseconds) {
    end = new Date().getTime();
  }
}

/**
 * permite la maquetacion en el chat para el mensaje enviado por parte del sistema
 * @param {*} name
 * @param {*} mensaje
 */

function createMensajeSystem(name, mensaje, fecha) {
  //capturamos el div principal
  var padre = document.getElementsByClassName("direct-chat-messages");

  var div = document.createElement("div"); //creamos el div
  div.setAttribute("class", "direct-chat-msg");
  //creamos el titulo
  var div2 = document.createElement("div");
  div2.setAttribute("class", "direct-chat-infos clearfix");

  var span1 = document.createElement("span");
  span1.setAttribute("class", "direct-chat-name float-left");
  div2.textContent = name;
  var span2 = document.createElement("span");
  span2.setAttribute("class", "direct-chat-timestamp float-right");
  span2.textContent = fecha;
  div2.appendChild(span1);
  div2.appendChild(span2);

  var div3 = document.createElement("div");
  div3.textContent = mensaje;
  div3.setAttribute("class", "direct-chat-text");

  //agregamos el titulo y el parrafo al div creado
  div.appendChild(div2);
  div.appendChild(div3);

  //añadimos todo al div seleccionado, en este caso el primer div que contenga la clase div2
  padre[0].appendChild(div);
}

/**
 * permite la maquetacion en el chat para el mensaje enviado por parte del usuario
 * @param {*} name
 * @param {*} mensaje
 */

function createMensajeUser(name, mensaje, fecha) {
  //capturamos el div principal
  var padre = document.getElementsByClassName("direct-chat-messages");

  var div = document.createElement("div"); //creamos el div

  div.setAttribute("class", "direct-chat-msg right");
  //creamos el titulo
  var div2 = document.createElement("div");
  div2.setAttribute("class", "direct-chat-infos clearfix");

  var span1 = document.createElement("span");
  span1.setAttribute("class", "direct-chat-name float-right");
  span1.textContent = name;
  var span2 = document.createElement("span");
  span2.setAttribute("class", "direct-chat-timestamp float-left");
  span2.textContent = fecha;
  div2.appendChild(span1);
  div2.appendChild(span2);

  var div3 = document.createElement("div");
  div3.textContent = mensaje;
  div3.setAttribute("class", "direct-chat-text");

  //agregamos el titulo y el parrafo al div creado
  div.appendChild(div2);
  div.appendChild(div3);

  //añadimos todo al div seleccionado, en este caso el primer div que contenga la clase div2
  padre[0].appendChild(div);
}

/*
createMensajeUser("user","Respuesta","01/01/2021");

createMensajeSystem("system","Respuesta","01/01/2021");*/