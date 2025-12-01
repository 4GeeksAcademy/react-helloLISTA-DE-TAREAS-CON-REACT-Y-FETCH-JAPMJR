import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tarea, setTarea] = useState("");
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  
  const username = "demo";
  
  const cargarTareas = async () => {
    setCargando(true);

    try {
      const resp = await fetch("https://playground.4geeks.com/todo/users/" + username);
      const data = await resp.json();
      if (data.todos) {
        setLista(data.todos);
      } else {
        setLista([]);
      }

      console.log("GET:", data);

    } catch (e) {
      console.log("Error:", e);
      setError("No se pudieron cargar las tareas");
      setLista([]);
    }

    setCargando(false);
  };

  const agregarTarea = async () => {
    if (tarea === "") {
      return;
    }

    try {
      const resp = await fetch("https://playground.4geeks.com/todo/users/" + username + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          label: tarea,
          done: false
        })
      });

      await resp.json();

      setTarea(""); 
      cargarTareas(); 

    } catch (error) {
      console.log("Error agregando:", error);
    }
  };

   const eliminarTarea = async (id) => {
    try {
      await fetch(
        "https://playground.4geeks.com/todo/users/" + username + "/todos/" + id,
        { method: "DELETE" }
      );

      cargarTareas();

    } catch (e) {
      console.log("Error eliminando:", e);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Mi Lista de Tareas</h1>

      <input
        type="text"
        placeholder="Escribe una tarea"
        value={tarea}
        onChange={(e) => setTarea(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            agregarTarea();
          }
        }}
      />

      <button onClick={agregarTarea}>
        Agregar
      </button>

      <ul>
        {lista.length > 0 ? (
          lista.map((item) => (
            <li key={item.id}>
              {item.label}
              <button onClick={() => eliminarTarea(item.id)}>X</button>
            </li>
          ))
        ) : (
          <li>No hay tareas</li>
        )}
      </ul>

      <p>Total de tareas: {lista.length}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TodoList;




