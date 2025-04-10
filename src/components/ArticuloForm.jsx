const ArticuloForm = ({
  prendas,
  talles,
  telas,
  todosLosAgregados,
  numeroArticulo,
  selectedPrenda,
  selectedTalle,
  selectedTela,
  selectedAgregados,
  agregadoParaAgregar,
  cantidad,
  ganancia,
  comentario,
  setNumeroArticulo,
  setSelectedPrenda,
  setSelectedTalle,
  setSelectedTela,
  setSelectedAgregados,
  setAgregadoParaAgregar,
  setCantidad,
  setGanancia,
  setComentario,
  handleAgregarAgregado,
  handleRemoveAgregado,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de Artículo
        </label>
        <input
          type="number"
          value={numeroArticulo}
          onChange={(e) => setNumeroArticulo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prenda
        </label>
        <select
          value={selectedPrenda}
          onChange={(e) => setSelectedPrenda(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Seleccionar prenda</option>
          {Array.isArray(prendas) &&
            prendas.map((prenda) => (
              <option key={prenda.id} value={prenda.nombre}>
                {prenda.nombre}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Talle
        </label>
        <select
          value={selectedTalle}
          onChange={(e) => setSelectedTalle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Seleccionar talle</option>
          {talles.map((talle, index) => (
            <option key={index} value={talle}>
              {talle}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tela
        </label>
        <select
          value={selectedTela}
          onChange={(e) => setSelectedTela(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Seleccionar tela</option>
          {telas.map((tela, index) => (
            <option key={index} value={tela.nombre}>
              {tela.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ganancia (%)
        </label>
        <input
          type="number"
          value={ganancia}
          onChange={(e) =>
            setGanancia(Math.min(parseFloat(e.target.value), 100))
          }
          className="w-full p-2 border border-gray-300 rounded"
          min=""
          max="100"
          step="0.1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad
        </label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agregados
        </label>
        <div className="flex">
          <select
            value={agregadoParaAgregar}
            onChange={(e) => setAgregadoParaAgregar(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccionar agregado</option>
            {todosLosAgregados
              .filter(
                (agregado) => !selectedAgregados.includes(agregado.nombre)
              )
              .map((agregado, index) => (
                <option key={index} value={agregado.nombre}>
                  {agregado.nombre}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={handleAgregarAgregado}
            className="ml-2 bg-blue-500 text-white p-2 rounded"
          >
            +
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agregados seleccionados
        </label>
        <div className="border border-gray-300 rounded p-2 min-h-12">
          {selectedAgregados.length > 0 ? (
            <ul className="space-y-1">
              {selectedAgregados.map((agregado, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{agregado}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgregado(agregado)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Ningún agregado seleccionado</p>
          )}
        </div>
      </div>
      <div className="col-span-4">
        <label className="block text-sm font-medium text-gray-700">
          Comentario
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          rows="3"
          placeholder="Ingrese un comentario (opcional)"
        />
      </div>
    </div>
  );
};

export default ArticuloForm;
