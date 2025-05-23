import { useState, useEffect } from "react";
import { PencilIcon, PlayIcon } from "@heroicons/react/24/outline";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const Etapas = ({ articuloId, pedidosId, cantidadArticulo }) => {
  const [etapas, setEtapas] = useState([]);
  const [editEtapa, setEditEtapa] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [firstDate, setFirstDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [lastEtapa, setLastEtapa] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuario_id");

  useEffect(() => {
    fetchEtapas();
    fetchUsuarios();
  }, [articuloId]);

  const fetchEtapas = async () => {
    try {
      const response = await fetch(
        `${API_URL}/etapas?articulos_id=${articuloId}`
      );
      const data = await response.json();
      const filteredEtapas = data.filter(
        (etapa) => etapa.articulos_id == articuloId
      );
      setEtapas(filteredEtapas);
      if (filteredEtapas.length > 0) {
        const sortedEtapas = [...filteredEtapas].sort(
          (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
        );
        const firstDate = sortedEtapas[0].fecha_inicio;
        const lastDate = sortedEtapas[sortedEtapas.length - 1].fecha_fin;

        setFirstDate(formatDateForDisplay(firstDate));
        setLastDate(formatDateForDisplay(lastDate));

        const lastEtapa = filteredEtapas.find(
          (etapa) => etapa.fecha_fin === lastDate
        );
        setLastEtapa(lastEtapa);
      }
    } catch (error) {
      console.error("Error fetching etapas", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error fetching usuarios", error);
    }
  };

  const handleStartEtapa = async (etapaId) => {
    if (!token || !usuarioId) {
      console.error("No se encontró el token o usuario_id");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/etapas/${etapaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha_inicio: new Date().toISOString().split("T")[0],
          usuario_id: usuarioId,
        }),
      });

      if (response.ok) {
        setEtapas((prevEtapas) =>
          prevEtapas.map((etapa) =>
            etapa.id === etapaId
              ? {
                  ...etapa,
                  fecha_inicio: new Date().toISOString().split("T")[0],
                  usuario_id: usuarioId,
                }
              : etapa
          )
        );
        fetchEtapas(); 
      } else {
        const data = await response.json();
        console.error("Error al iniciar la etapa:", data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleUpdateEtapa = async (e) => {
    e.preventDefault();
    if (!token || !usuarioId) {
      console.error("No se encontró el token o usuario_id");
      return;
    }

    if (editEtapa.cantidad === "") {
      alert("Debes ingresar una cantidad");
      return;
    }

    if (editEtapa.cantidad > cantidadArticulo) {
      alert("No puedes ingresar una cantidad mayor a la del artículo");
      return;
    }

    if (
      editEtapa.nombre === "Corte" &&
      editEtapa.cantidad === cantidadArticulo &&
      (!editEtapa.tela || editEtapa.tela === "")
    ) {
      alert("Debes ingresar un valor para Tela en la etapa de Corte");
      return;
    }

    if (editEtapa.cantidad < cantidadArticulo) {
      setConfirmAction(() => async () => {
        await performUpdate();
        setShowConfirmModal(false);
      });
      setShowConfirmModal(true);
      return;
    }

    await performUpdate();
  };

  const performUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/etapas/${editEtapa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editEtapa,
          fecha_fin: new Date().toISOString().split("T")[0],
          usuario_id: usuarioId,
          cantidad: editEtapa.cantidad === "" ? 0 : editEtapa.cantidad,
          tela:
            editEtapa.nombre === "Corte" &&
            editEtapa.cantidad === cantidadArticulo
              ? Number(editEtapa.tela)
              : undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsEditModalOpen(false);
        fetchEtapas();
      } else {
        console.error("Error al actualizar la etapa:", data.message);
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    }
  };

  const handleEditClick = (etapa) => {
    setEditEtapa({
      ...etapa,
      fecha_inicio: formatDateForInput(etapa.fecha_inicio),
      fecha_fin: new Date().toISOString().split("T")[0],
      cantidad: etapa.cantidad ?? cantidadArticulo,
      tela: etapa.tela ?? "",
      showWarning: false,
      exceedsLimit: false,
    });
    setIsEditModalOpen(true);
  };

  const getUsuarioNombre = (usuarioId) => {
    const usuario = usuarios.find((user) => user.id === usuarioId);
    return usuario ? usuario.usuario : "Usuario no encontrado";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">ETAPAS</h1>
      {/* Modal de confirmación de actualización */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border-2 border-red-500">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-red-600 mb-4">
                ¡Atención!
              </h3>
              <p className="mb-4">
                Estás registrando {editEtapa.cantidad} unidades en lugar de{" "}
                {cantidadArticulo}. ¿Deseas continuar?
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => {
                    confirmAction && confirmAction();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de edición */}
      {isEditModalOpen && editEtapa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <form onSubmit={handleUpdateEtapa}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Etapa</label>

                <h3 className="w-full p-2 border border-gray-300 rounded">
                  {editEtapa.nombre}
                </h3>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Inicio</label>
                <input
                  type="date"
                  value={editEtapa.fecha_inicio}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={new Date().toISOString().split("T")[0]}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Cantidad (Artículo: {cantidadArticulo})
                </label>
                <input
                  type="number"
                  value={editEtapa.cantidad ?? ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const newCantidad =
                      inputValue === "" ? "" : parseInt(inputValue) || 0;

                    setEditEtapa({
                      ...editEtapa,
                      cantidad: newCantidad,
                      exceedsLimit:
                        newCantidad !== "" && newCantidad > cantidadArticulo,
                    });
                  }}
                  min="0"
                  max={cantidadArticulo}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
                {editEtapa.exceedsLimit && (
                  <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
                    No puedes ingresar una cantidad mayor a la del artículo
                  </div>
                )}
                {editEtapa.cantidad !== "" &&
                  editEtapa.cantidad < cantidadArticulo && (
                    <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
                      <p>Se requerirá confirmación para cantidades menores</p>
                    </div>
                  )}
              </div>
              {/* Campo Tela - Solo visible para etapa "Corte" */}
              {editEtapa.nombre === "Corte" && (
                <div className="mb-4">
                  <label className="block text-gray-700">Tela</label>
                  <input
                    type="number"
                    value={editEtapa.tela}
                    onChange={(e) =>
                      setEditEtapa({
                        ...editEtapa,
                        tela: e.target.value,
                      })
                    }
                    min="0"
                    step="1"
                    className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                      editEtapa.cantidad !== cantidadArticulo
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    required={editEtapa.cantidad === cantidadArticulo}
                    disabled={editEtapa.cantidad !== cantidadArticulo}
                    placeholder="Ingrese la cantidad de tela"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700">Comentario</label>
                <textarea
                  value={editEtapa.comentario}
                  onChange={(e) =>
                    setEditEtapa({ ...editEtapa, comentario: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                  disabled={editEtapa.showWarning && !editEtapa.forceUpdate}
                >
                  Actualizar Etapa
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Tabla de Etapas */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Fecha de Inicio</th>
            <th className="py-2 px-4 border-b text-left">Fecha de Fin</th>
            <th className="py-2 px-4 border-b text-left">Comentario</th>
            <th className="py-2 px-4 border-b text-left">Usuario</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
            <th className="py-2 px-4 border-b text-left">Iniciar</th>
          </tr>
        </thead>
        <tbody>
          {etapas.map((etapa) => (
            <tr key={etapa.id}>
              <td className="py-2 px-4 border-b">{etapa.nombre}</td>
              <td className="py-2 px-4 border-b">
                {formatDateForDisplay(etapa.fecha_inicio)}
              </td>
              <td className="py-2 px-4 border-b">
                {formatDateForDisplay(etapa.fecha_fin)}
              </td>
              <td className="py-2 px-4 border-b">{etapa.comentario}</td>
              <td className="py-2 px-4 border-b">
                {getUsuarioNombre(etapa.usuario_id)}
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleEditClick(etapa)}>
                  <PencilIcon className="h-5 w-5 ml-5" />
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleStartEtapa(etapa.id)}
                  className="bg-blue-500 text-white px-1 py-1.5 rounded-full hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <PlayIcon
                    className="h-6 w-6 text-center ml-1"
                    strokeWidth={3}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
