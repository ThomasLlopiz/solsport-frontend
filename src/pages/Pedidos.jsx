import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";

export const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [newPedido, setNewPedido] = useState({
    numero_pedido: "",
    nombre_cliente: "",
    correo: "",
    telefono: "",
    localidad: "",
    fecha_pago: "",
    fecha_estimada: "",
  });
  const [editPedido, setEditPedido] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos`);
      const data = await response.json();
      const pedidosFiltrados = data.filter((pedido) => pedido.estado === 1);
      setPedidos(pedidosFiltrados);
    } catch (error) {
      console.error("Error fetching pedidos", error);
    }
  };

  const handleCreatePedido = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPedido),
      });
      if (response.ok) {
        setNewPedido({
          numero_pedido: "",
          nombre_cliente: "",
          correo: "",
          telefono: "",
          localidad: "",
          fecha_pago: "",
          fecha_estimada: "",
        });
        setIsCreateModalOpen(false);
        fetchPedidos();
      } else {
        console.error("Error creating pedido");
      }
    } catch (error) {
      console.error("Error creating pedido", error);
    }
  };

  const handleUpdatePedido = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/pedidos/${editPedido.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editPedido),
      });
      if (response.ok) {
        setEditPedido(null);
        setIsEditModalOpen(false);
        fetchPedidos();
      } else {
        console.error("Error updating pedido");
      }
    } catch (error) {
      console.error("Error updating pedido", error);
    }
  };

  const handleEditClick = (pedido) => {
    setEditPedido({
      ...pedido,
      fecha_pago: pedido.fecha_pago ? pedido.fecha_pago.slice(0, 10) : "",
      fecha_estimada: pedido.fecha_estimada
        ? pedido.fecha_estimada.slice(0, 10)
        : "",
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (pedidoId) => {
    navigate(`/pedidos/${pedidoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">PEDIDOS</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Crear Nuevo Pedido
        </button>
      </div>

      {/* Modal de Crear Pedido */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Pedido</h2>
            <form onSubmit={handleCreatePedido}>
              <div className="mb-4">
                <label className="block text-gray-700">Número de Pedido</label>
                <input
                  type="text"
                  value={newPedido.numero_pedido}
                  onChange={(e) =>
                    setNewPedido({
                      ...newPedido,
                      numero_pedido: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={newPedido.nombre_cliente}
                  onChange={(e) =>
                    setNewPedido({
                      ...newPedido,
                      nombre_cliente: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo</label>
                <input
                  type="email"
                  value={newPedido.correo}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, correo: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={newPedido.telefono}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, telefono: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Localidad</label>
                <input
                  type="text"
                  value={newPedido.localidad}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, localidad: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Pago</label>
                <input
                  type="date"
                  value={newPedido.fecha_pago}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, fecha_pago: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha Estimada</label>
                <input
                  type="date"
                  value={newPedido.fecha_estimada}
                  onChange={(e) =>
                    setNewPedido({
                      ...newPedido,
                      fecha_estimada: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                >
                  Crear Pedido
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edición de Pedido */}
      {isEditModalOpen && editPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Pedido</h2>
            <form onSubmit={handleUpdatePedido}>
              <div className="mb-4">
                <label className="block text-gray-700">Número de Pedido</label>
                <input
                  type="text"
                  value={editPedido.numero_pedido}
                  onChange={(e) =>
                    setEditPedido({
                      ...editPedido,
                      numero_pedido: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={editPedido.nombre_cliente}
                  onChange={(e) =>
                    setEditPedido({
                      ...editPedido,
                      nombre_cliente: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo</label>
                <input
                  type="email"
                  value={editPedido.correo}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, correo: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={editPedido.telefono}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, telefono: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Localidad</label>
                <input
                  type="text"
                  value={editPedido.localidad}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, localidad: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Pago</label>
                <input
                  type="date"
                  value={editPedido.fecha_pago}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, fecha_pago: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha Estimada</label>
                <input
                  type="date"
                  value={editPedido.fecha_estimada}
                  onChange={(e) =>
                    setEditPedido({
                      ...editPedido,
                      fecha_estimada: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                >
                  Guardar Cambios
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

      {/* Tabla de Pedidos */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Número de Pedido</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-left">Correo</th>
              <th className="py-3 px-6 text-left">Teléfono</th>
              <th className="py-3 px-6 text-left">Localidad</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {pedidos.map((pedido) => (
              <tr
                key={pedido.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {pedido.numero_pedido}
                </td>
                <td className="py-3 px-6 text-left">{pedido.nombre_cliente}</td>
                <td className="py-3 px-6 text-left">{pedido.correo}</td>
                <td className="py-3 px-6 text-left">{pedido.telefono}</td>
                <td className="py-3 px-6 text-left">{pedido.localidad}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(pedido)}
                      className="transform hover:text-purple-500 hover:scale-110"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewClick(pedido.id)}
                      className="transform hover:text-blue-500 hover:scale-110"
                    >
                      <EyeIcon className="h-6 w-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
