$(document).ready(function(){
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAdGH9NNUF-Gc8kg_Wpv2mp8HSyYzEO7dA",
        authDomain: "todolist-8bc82.firebaseapp.com",
        databaseURL: "https://todolist-8bc82.firebaseio.com",
        projectId: "todolist-8bc82",
        storageBucket: "todolist-8bc82.appspot.com",
        messagingSenderId: "312582847547",
        appId: "1:312582847547:web:ad57085176fba71726b01e",
        measurementId: "G-V69H4WTX55"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.firestore();
    var tablaTareas = database.collection("tareas");

    tablaTareas.get()
        .then(function(snapshot){
            snapshot.docs.map(doc => {
                $(".tasks ul").append(`
                    <li class="active" id="${doc.id}">
                        <p>${doc.data().tarea}</p>
                        <a href="#" data-id="${doc.id}">Complete</a>
                    </li>
                `)
            })
        })
        .catch(function(error){
            alert("Error al traer las tareas")
        })

    $("#add-todo").submit(function(event){
        event.preventDefault();
        var tarea = $("#add-todo #task").val();

        if(tarea.trim() === ""){
            alert("Tiene que ingresar alguna descripcion a la tarea.")
            return;
        }

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
    });
});
