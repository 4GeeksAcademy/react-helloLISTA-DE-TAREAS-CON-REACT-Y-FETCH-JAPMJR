import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tarea, setTarea] = useState("");
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const username = "jesus";


  const crearUsuario = async () => {
    try {
      const resp = await fetch("https://playground.4geeks.com/todo/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });

      console.log("crearUsuario:", resp.ok, resp.status);

      if (resp.ok) return true;
      else {
        console.log("Usuario ya existe");
        return false;
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
      return false;
    }
  };


  const cargarTareas = async () => {
    setCargando(true);
    try {
      const resp = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
      const data = await resp.json();


      setLista(data.todos || []);
      console.log("GET response:", data);
    } catch (e) {
      console.error("Error cargando tareas:", e);
      setError("Error cargando tareas");
      setLista([]);
    }
    setCargando(false);
  };

  
  const agregarTarea = async () => {
    if (!tarea) return;
    try {
      const resp = await fetch(`https://playground.4geeks.com/todo/users/${username}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: tarea, done: false })
      });

      if (!resp.ok) throw new Error("POST failed " + resp.status);

      setTarea("");
      cargarTareas();
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  const eliminarTarea = async (id) => {
    setCargando(true);
    try {
      await fetch(`https://playground.4geeks.com/todo/users/${username}/todos/${id}`, {
        method: "DELETE"
      });
      cargarTareas();
    } catch (e) {
      console.error("Error eliminando tarea:", e);
      setError("Error eliminando tarea");
    }
    setCargando(false);
  };

  useEffect(() => {
    const init = async () => {
      await crearUsuario();
      cargarTareas();
    };
    init();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Mi Lista de Tareas</h1>

      <input
        type="text"
        placeholder="Escribe una tarea"
        value={tarea}
        onChange={(e) => setTarea(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && agregarTarea()}
        disabled={cargando}
      />

      <button onClick={agregarTarea} disabled={cargando}>Agregar</button>
    
      <ul>
        {Array.isArray(lista) ? (
          lista.map((t) => (
            <li key={t.id}>
              {t.label}
              <button onClick={() => eliminarTarea(t.id)}>X</button>
            </li>
          ))
        ) : (
          <li>No hay tareas</li>
        )}
      </ul>

      <p>Ttal de tareas: {lista.length}</p>
    </div>
  );
};

export default TodoList;
