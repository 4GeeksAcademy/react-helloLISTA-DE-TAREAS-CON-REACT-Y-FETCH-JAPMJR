import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tarea, setTarea] = useState(""); 
  const [lista, setLista] = useState([]); 
  const [cargando, setCargando] = useState(false); 
  const [error, setError] = useState(null); 
  const username = "jesus"; 

 
  const crearUsuario = async () => {
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
    } catch (e) {
      console.log("no se pudo crear usuario");
    } finally {
      cargarTareas();
    }
  };


  const cargarTareas = async () => {
    setCargando(true);
    setError(null);
    try {
      const resp = await fetch(
        `https://playground.4geeks.com/todo/todos/${username}`
      );
      const data = await resp.json();
      if (Array.isArray(data)) setLista(data);
      else setLista([]);
    } catch (e) {
      console.log(e);
      setError("Error cargando tareas");
      setLista([]);
    }
    setCargando(false);
  };

 
  const agregarTarea = async () => {
    if (tarea.trim() === "") return;
    setCargando(true);
    const nuevaLista = [...lista, { label: tarea, done: false }];
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaLista),
      });
      setTarea("");
      cargarTareas();
    } catch (e) {
      console.log(e);
      setError("Error agregando tarea");
    }
    setCargando(false);
  };


  const eliminarTarea = async (i) => {
    setCargando(true);
    const nuevaLista = lista.filter((_, index) => index !== i);
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaLista),
      });
      cargarTareas();
    } catch (e) {
      console.log(e);
      setError("Error eliminando tarea");
    }
    setCargando(false);
  };

  useEffect(() => {
    crearUsuario();
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
      <button onClick={agregarTarea} disabled={cargando}>
  Agregar
</button>
<button onClick={() => setTarea("")} disabled={cargando}>
  Limpiar
</button>

      {cargando && <p>Procesando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {lista.length === 0 && <li>No hay tareas</li>}
        {lista.map((t, i) => (
          <li key={i}>
            {t.label}{" "}
            <button onClick={() => eliminarTarea(i)} disabled={cargando}>
              
            </button>
          </li>
        ))}
      </ul>

      <p>Total de tareas: {lista.length}</p>

      <p style={{ fontSize: "12px", color: "#666" }}>
        Ver lista en:{" "}
        <a
          href={`https://playground.4geeks.com/todo/todos/${username}`}
          target="_blank"
        >
          https://playground.4geeks.com/todo/todos/{username}
        </a>
      </p>
    </div>
  );
};

export default TodoList;
