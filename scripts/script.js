$(document).ready(function(){
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.firestore();
    var tablaTareas = database.collection("tareas");

    /**
     * Esta función se encargta de cargar las tareas anteriormente
     * creadas, se puede usar también para recargar la lista en
     * cualquier momento.
     */
    function cargarTareas(){
        //Primero limpiamos toda la lista de tareas, no queremos ver duplicados
        // pueden ver la documentación de .empty() acá: https://api.jquery.com/empty/
        $(".tasks ul").empty();

        // Luego de limpiar la lista, buscamos todas las tareas desde Firestore
        // La documentación está acá: https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#get
        tablaTareas.get()
            .then(function(snapshot){
                // El snapshot, es una fotografía de los elementos de la Base de Datos (BD)
                snapshot.docs.map(doc => {
                    // Si quieres ver qué tiene cada tarea, descomenta el siguiente log
                    //console.log(doc.data());

                    var completado;
                    if(doc.data().completado === true){
                        completado = "completed";
                    } else {
                        completado = "active"
                    }

                    // Agregamos un nuevo <li> con el conteindo de cada tarea
                    $(".tasks ul").append(`
                        <li class="${completado}" id="${doc.id}">
                            <p>${doc.data().tarea}</p>
                            <a href="#" data-id="${doc.id}">Complete</a>
                        </li>
                    `)
                })
            })
            .catch(function(error){
                alert("Error al traer las tareas. " + error.message )
            })
    }

    // Llamamos a cargarTareas, para que cuando cargue la página, carguen todas las tareas
    cargarTareas();

    /**
     * Esta función, se encarga de recibir una tarea por parámetro, apra crearla en la base
     * de datos, la tarea es lo que se capture del input del usuario.
     * 
     * Documentación: https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#add
     * 
     * @param {string} tarea
     */
    function crearTarea(tarea) {
        tablaTareas.add(
            {
                tarea: tarea,
                completado: false
            }
        )
        .then(function(docRef) {
            $(".tasks ul").append(`
                <li class="active" id="${docRef.id}">
                    <p>${tarea}</p>
                    <a href="#" data-id="${docRef.id}">Complete</a>
                </li>
            `)
        })
        .catch(function(error){
            alert("Error Guardando")
        });
    }

    /**
     * Esta función se encarga de actualizar las tareas basado en el ID.
     * Para vermás sobre esta funcion visita https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#update
     * 
     * @param {string} docId Identificado único de la tarea, viene desde la BD
     *                       y lo usamos como #id del <li>
     */
    function actualizarEstadoTarea(docId){
        // Seleccionamos la tarea mediante el ID
        var documentoTarea = tablaTareas.doc(docId);

        // Ya que el <li> de la tarea tiene como atributo id el de la tarea, podemos seleciconarlo
        // usandolo como selector. Si quieres ver esto, inspecciona el código y revisa qué id tiene
        // cada tarea de la lista, vas a ver que concuerdan con el de la BD
        documentoTarea.update({completado: true})
            .then(function(){
                $("#" + docId).addClass('completed');
            })
            .catch(function(error){
                alert("No se ha podido actualizar la tarea " + docId + " ." + error.message);
            });
    }

    /**
     * Este evento, le agrega el evento click al botón de completado de cada tarea,
     * para más información de la función .on(), puedes leer https://www.w3schools.com/jquery/event_on.asp
     */
    $('body').on('click', ".tasks ul li a", function(event){
        event.preventDefault(); // Para aprender más sobre el preventdefault lee https://www.w3schools.com/jsref/event_preventdefault.asp

        // Si ves, cuando creamos el link del boton, tiene un atributo llamado data-id, con 
        var idTarea = $(this).data('id');

        // Llamamos la función actualizarEstadoTarea y le pasamos el ID de la tarea que queremos completar
        actualizarEstadoTarea(idTarea);
    })

    /**
     * Esta sección le agrega un evento al Form, para que cada vez que se envíe,
     * le permita interrumpir el proceso de enviado, capturar la información y poder 
     * lograr la lógica deseada. Documentación: https://api.jquery.com/submit/
     */
    $("#add-todo").submit(function(event){
        event.preventDefault(); // Para aprender más sobre el preventdefault lee https://www.w3schools.com/jsref/event_preventdefault.asp
        var tarea = $("#add-todo #task").val();

        if(tarea.trim() === ""){
            alert("Tiene que ingresar alguna descripcion a la tarea.")
            return;
        }

        // Llamamos la fucnion crearTarea y le pasamos la tarea ingresada por el usuario
        crearTarea(tarea);

        // Ahora limpiamos el input para que el usuario no ingrese la misma tarea por error
        var tarea = $("#add-todo #task").val("");
    });
});
