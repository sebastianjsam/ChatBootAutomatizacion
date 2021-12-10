var chat = "";

const db = firebase.firestore();
var preguntas = 1;
const taskForm = document.getElementById("task-form2");
/*
//---------------
//creando arbol
// hint: TreeModel, tree and root are
// globally available on this page
tree = new TreeModel();
var nodoEstado=null;
/*
root = tree.parse({
  id: 1,
  children: [
    {
      id: 11,
      mensaje: "Hola",
      respuesta: "Hola",
      //children: [{ id: 111 }],
    },
    {
      id: 12,
      mensaje: "Registrar",
      respuesta: "Por favor dilegenciar los siguientes datos:" +
      "\n" +
      "Nombre(s)\nApellidos\nNumero de identificacion \nEntidad prestadora de salud a la que pertenece\nUrl(Alojamiento emitidad por el medico)",
      children: [
        {
          id: 111,
          mensaje: "",
          respuesta:"numero de identificacion",
          children:[
            {
              id: 300,
              mensaje: "",
              respuesta:"Entidad prestadora de salud a la que pertenece",
              children:[
                {
                  id: 400,
                  mensaje: "",
                  respuesta:"Url",
                }
              ]
            }
          ]
        },
        {
          id: 122,
        },
      ],
    },
    {
      id: 13,
    },
  ],
});
*/
//--segunda
var nodes = new Node(1, false, "", "");
var binarySearchTree = new BinarySearchTree();
var binarySearchTreeCopy = new BinarySearchTree();
binarySearchTree.root = nodes;
//tenemos el padre
binarySearchTree.insert(new Node(2, false, "HOLA", "Hola"));

//secuencia de respuesta
//cita

var nodoTemporal = new Node(
  3,
  false,
  "CITA",
  "Por favor dilegenciar los siguientes datos: Nombre y apellidos"
);

var nodohijo = new Node(4, true, "", "numero de indentificacion");
nodoTemporal.children.push(nodohijo);
binarySearchTree.insert(nodoTemporal);

///
var nodoTemporal = new Node(
  3,
  false,
  "Consultar",
  "Por favor digite el numero de radicado"
);

var nodohijo = new Node(
  4,
  true,
  "R",
  "se realiza la consulta a la base de datos"
);
nodoTemporal.children.push(nodohijo);
binarySearchTree.insert(nodoTemporal);

//------
//se debe de realizar al final para que coja todos los datos agregados

binarySearchTreeCopy = { ...binarySearchTree };

//-------------

const saveUser = (Name, LastName, ID, Entity, URL) =>
  db.collection("usuarios").doc().set({
    Name,
    LastName,
    ID,
    Entity,
    URL,
  });



  const almacenarCita = (IdCita, IdUsuario, asignado, especialista,fecha) =>
  db.collection("cita").doc().set({
    
    IdCita, IdUsuario, asignado, especialista,fecha
  });


//const getUsers = () => db.collection("usuarios").get();
const getUsers = () => db.collection("usuarios").where("Cita", "==", false).get();
//const getFechas = () => db.collection("medicos").where("nombre", "==", "Dr. Juan Pablo Rodríguez Gallego").get();

const getNeumologos = () => db.collection("neumologos").get();
const getCita = () => db.collection("cita").get();
const getUserAsign = () => db.collection("usuariosAsignados").get();
const getFechas = () => db.collection("fechas").get();





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

  //procesar palabra

  const texto = document.getElementById("message");
  console.log(texto.value);
  //procesarTexto(texto.value);
  createMensajeUser("user", texto.value, "01/01/2021");
  createMensajeSystem("system", procesarTexto(texto.value), "01/01/2021");

  //borrar mensaje
  texto.value = "";
});

/**
 * cargar todos los datos para la asignacion de citas
 * @param {carga} objetoPatient
 */
async function cargarDatosAsignacionDeCitas() {
  //pruebas de consumo a get

  /*
  const querySnapshot = await getUsers();
  querySnapshot.forEach((doc) => {
    console.log("name? ", doc.data());
    addNamePatient(doc.data());
  });
  console.log("fin");
*/
  
  const querySnapshot = await getCita();
  querySnapshot.forEach((doc) => {
    console.log("Citas? ", doc);
    var citas=doc.data();
    addNamePatient(citas);
  });
  console.log("fin");


  const querySnapshot2 = await getNeumologos();
  querySnapshot2.forEach((doc) => {
    console.log(doc.data());
    addNameNeumologos(doc.data());
  });
  console.log("2 fin");

  const querySnapshot3 = await getFechas();
  querySnapshot3.forEach((doc) => {
    console.log(doc.data());

    addNameFechas(doc.data());
  });
  console.log("3 fin");

  const querySnapshot4 = await getUsers();
  querySnapshot4.forEach((doc) => {
    console.log("------",doc.data());
    console.log("-- ¿id?"+doc.id)
    addNamePatient(doc.data(),doc.id)
  });
  console.log("4 fin");
}

function addNamePatient(objetoPatient,id) {
  var padre = document.getElementById("NamePatient");
  var option1 = document.createElement("option");
  option1.setAttribute("value",id);
  
  option1.textContent = objetoPatient.Name;
  padre.appendChild(option1);
}

function addNameNeumologos(objetoNeumologo) {
  var padre = document.getElementById("NameNeumologo");
  var option1 = document.createElement("option");
  //option1.setAttribute("class", "direct-chat-name float-left");
  option1.textContent = objetoNeumologo.Name;
  padre.appendChild(option1);
}

function addNameFechas(objetoFechas) {
  var padre = document.getElementById("NameFechas");
  var option1 = document.createElement("option");
  //option1.setAttribute("class", "direct-chat-name float-left");
  option1.textContent = objetoFechas.fecha.toDate().toDateString();
  padre.appendChild(option1);
}
//procesarTexto("HOLa");
var ContadorRespuestas = 0;
function procesarTexto(texto) {
  console.log("Ejecucion de nodos " + binarySearchTree);
  console.log("Antes ", binarySearchTreeCopy);

  for (var i = 0; i < binarySearchTreeCopy.root.children.length; i++) {
    console.log(
      binarySearchTreeCopy.root.children[i].mensaje.toUpperCase() +
        "    =       " +
        texto.toUpperCase()
    );

    if (
      binarySearchTreeCopy.root.children[i].mensaje.toUpperCase() ==
      texto.toUpperCase()
    ) {
      var temporal = binarySearchTreeCopy.root.children[i].respuesta;
      if (binarySearchTreeCopy.root.children[i].children.length != 0) {
        binarySearchTreeCopy.root = binarySearchTreeCopy.root.children[i];
        ContadorRespuestas = ContadorRespuestas + 1;
      }
      return temporal;
    }
    if (binarySearchTreeCopy.root.children[i].mensaje.toUpperCase() == "R") {
      binarySearchTreeCopy = { ...binarySearchTree };
      ContadorRespuestas = 0;
      console.log("consultando BD");
      var temp= consultarEstadoCita(texto);
       delay(5);
      temp.then(function(result) {
        console.log('promise returned: ' + result);
        createMensajeSystem("System", result, "01/01/2021");
        return result;
      });

    //  setTimeout(function(){
    //     console.log("I am the third log after 5 seconds");

    //     createMensajeSystem("System", temp, "01/01/2021");
    //     return temp;
    // },5000);

      return "Por favor espere";
    }

    if (ContadorRespuestas > 0) {
      var temporal = binarySearchTreeCopy.root.children[i].respuesta;
      if (binarySearchTreeCopy.root.children.length != 0) {
        binarySearchTreeCopy.root = binarySearchTreeCopy.root.children[i];
        ContadorRespuestas = ContadorRespuestas + 1;
        return temporal;
      } else {
      }
      return temporal;
    }
  }
  if (binarySearchTreeCopy.root.esFinal == true) {
    binarySearchTreeCopy = { ...binarySearchTree };
    ContadorRespuestas = 0;
    //enviar los datos a la base de datos
    ///
    ///
    return "Registro exitoso: codigo de consulta: " + "wbKDC6mFfSkhFZg1hRnX";
  }

  if (texto.toUpperCase() == "SALIR") {
    binarySearchTreeCopy = { ...binarySearchTree };
    console.log(binarySearchTreeCopy);
    console.log(binarySearchTree);
    return "Gracias por comunicarte";
  }

  console.log("Despues: ", binarySearchTreeCopy);
  return "No te entiendo";
}

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}

//console.log("Cita   ",consultarEstadoCita("1"));

 async function consultarEstadoCita(codigo) {
  /*const getCita = () => db.collection("cita").get();

  

  const snapshot = await firebase.firestore().collection('cita').get()
    const documents = [];
    snapshot.forEach(doc => {
       documents[doc.id] = doc.data();
    });

    getCita.forEach(element => {
      if(element.IdCita==codigo)
      {
                return "Registro existe";
      }
    });
   
    console.log("document ",getCita );
    return "Registro no existe";
*/
var defau="";
  const querySnapshot = await getCita();
  querySnapshot.forEach((doc) => {
    console.log("name? ", doc.data());
  var datos=doc.data();
    console.log("comparacion citas.....: "+datos.IdCita.toString()+ "==" +codigo.toString());
  
    if (datos.IdCita.toString() == codigo.toString()&& defau=="") {
      
      if(datos.asignado==true){
        defau= "su cita fue asignada\n"+" medico: "+datos.especialista+" fecha: "+datos.fecha.toDate();
      }else{
        
        defau= "la asignacion de su cita se encuentra en tramite";
      }      
    }
  });

  if(defau!="")
  {
    return defau;
  }else
  {
return "Registro no existe";
  }

  console.log("document Error", getCita);
  return defau;
}

function procesarTexto2(texto) {
  syncDelay(1);
  if (texto.toUpperCase() == "HOLA") {
    chat = "Hola";
    return chat;
  } else if (texto.toUpperCase() == "REGISTRAR") {
    chat =
      "Por favor dilegenciar los siguientes datos:" +
      "\n" +
      "Nombre(s)\nApellidos\nNumero de intetificacion\nEntidad prestadora de salud a la que pertenece\nUrl(Alojamiento emitidad por el medico)";
    return chat;
  } else {
    return "No te entiendo";
  }
  console.log(texto);
}

/**
 * asignar citas
 * @param {a} milliseconds
 */
function asignarCita() {
  //extraemos los datos que estan selecionados en los cuadros
  var namepatient = "";
  var medicos = "";
  var fechasDisponibles = "";

  //capturar nombre paciente
  var idpatient = document.getElementById("NamePatient");
  var namepatient = idpatient.options[idpatient.selectedIndex].textContent;

  //capturar medico selecionado
  var idmedico = document.getElementById("NameNeumologo");
  var Namemedico = idmedico.options[idmedico.selectedIndex].textContent;

  //capturar la fecha
  var idfecha = document.getElementById("NameFechas");
  var fechasDisponibles = idfecha.options[idfecha.selectedIndex].textContent;

  var consecutivo = generateUUID(idpatient);

  console.log("datos de almacenar: "+consecutivo+" "+ namepatient+" "+"true"+" "+Namemedico+"  "+fechasDisponibles);
  almacenarCita(consecutivo, namepatient+"",true,Namemedico,fechasDisponibles);

  //cambiar estado de asignacion de cita
  var Cita=true;
  console.log("actualizar el paciente: "+idpatient.value);
  db.collection('usuarios').doc(idpatient.value+"").update({Cita});

  //IdCita, IdUsuario, asignado, especialista,fecha
  var temporal =
    "Asignar cita a \n" +
    "consecutivo: " +
    consecutivo +
    "\nNombre paciente: " +
    namepatient +
    "\nNombre medico: " +
    Namemedico +
    "\nfecha: " +
    fechasDisponibles;
  console.log(temporal);
  alert(temporal);
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxx4xxxyxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

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

  //añadimos todo al div seleccionado, en este caso el primer div que contenga la clase _div2_
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

  //añadimos todo al div seleccionado, en este caso el primer div que contenga la clase _div2_
  padre[0].appendChild(div);
}


/**
 * 
 * boton de enviar datos
 * 
 */




/*
createMensajeUser("user","Respuesta","01/01/2021");

createMensajeSystem("system","Respuesta","01/01/2021");*/
cargarDatosAsignacionDeCitas();
