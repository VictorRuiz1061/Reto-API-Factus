import { useState, useEffect } from "react";
import { useGetFacturas, usePostFactura, usePutFactura, useGetFacturasVer, useDescargarFacturas } from '@/hooks';
import type { Factura, FacturaCreateRequest } from '@/types';
import { Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal, Layout } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { FACTURA_DEFAULTS, generateReferenceCode } from "@/utils/facturaDefaults";
import { useGetMunicipios } from "@/hooks/Municipio/useGetMunicipios";
import { getFacturasVer } from '@/api/Facturas/getFacturas-ver';

const Facturas = () => {
  const { facturas, loading } = useGetFacturas();
  const { crearFactura } = usePostFactura();
  const { actualizarFactura } = usePutFactura();
  const { municipios } = useGetMunicipios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingNumber, setViewingNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Estado para los items dinámicos
  const [items, setItems] = useState([
    {
      code_reference: '',
      name: '',
      quantity: '1',
      price: '0',
      tax_rate: '19.00',
    },
  ]);

  // Hook para obtener detalles de una factura específica
  const { data: facturaDetalleResponse, loading: loadingDetalle } = useGetFacturasVer(viewingNumber || '');

  // useEffect para manejar automáticamente la apertura de la URL cuando los datos estén disponibles
  useEffect(() => {
  if (viewingNumber && facturaDetalleResponse && !loadingDetalle) {

    const bill = facturaDetalleResponse.bill;

    if (bill) {

      if (bill.public_url) {
        window.open(bill.public_url, '_blank', 'noopener,noreferrer');
        showSuccessToast('Abriendo factura en nueva pestaña');
      } else {
        showErrorToast('La factura no tiene URL pública disponible');
      }
    } else {
      showErrorToast('No se pudo obtener la información de la factura');
    }

    setViewingNumber(null);
  }
}, [facturaDetalleResponse, loadingDetalle, viewingNumber]);

  // Estado para manejar la descarga
  const [downloadingNumber, setDownloadingNumber] = useState<string | null>(null);
  const { data: facturaDescarga, loading: loadingDescarga } = useDescargarFacturas(downloadingNumber || '');

  // Efecto para descargar el PDF cuando los datos estén listos
  useEffect(() => {
    let base64 = undefined;
    let fileName = undefined;
    if (downloadingNumber && facturaDescarga) {
      if ('pdf_base_64_encoded' in facturaDescarga && 'file_name' in facturaDescarga) {
        base64 = facturaDescarga.pdf_base_64_encoded;
        fileName = (facturaDescarga.file_name || 'factura') + '.pdf';
      } else if ('data' in facturaDescarga && facturaDescarga.data.pdf_base_64_encoded) {
        base64 = facturaDescarga.data.pdf_base_64_encoded;
        fileName = (facturaDescarga.data.file_name || 'factura') + '.pdf';
      }
      if (base64 && fileName) {
        try {
          // Decodificar base64 a blob
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          // Crear enlace y descargar
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showSuccessToast('Factura descargada correctamente');
          } catch (e) {
          showErrorToast('Error al descargar el PDF');
        }
        setDownloadingNumber(null);
      }
    }
  }, [facturaDescarga, downloadingNumber]);


  const columns: Column<Factura & { key: string }>[] = [
    { key: "reference_code", label: "Código de Referencia", filterable: true },
    { key: "identification", label: "identificacion", filterable: true },
    { key: "email", label: "correo", filterable: true },
    { key: "names", label: "nombre", filterable: true },
    { key: "total", label: "Total", filterable: true },
    {
      key: "acciones", label: "Acciones", render: (factura) => (
        <div className="flex gap-2">
          <Botton onClick={() => handleView(factura)} className="bg-blue-500 text-white">Ver</Botton>
          <Botton onClick={() => handleDownload(factura)} className="bg-green-600 text-white" disabled={loadingDescarga && downloadingNumber === factura.number}>
            {loadingDescarga && downloadingNumber === factura.number ? 'Descargando...' : 'Descargar'}
          </Botton>
          {/* Botón QR DIAN: ahora llama a handleShowQR */}
          <Botton
            onClick={() => handleShowQR(factura)}
            className="bg-gray-700 text-white"
          >
            DIAN
          </Botton>
        </div>
      )
    }
  ];

  const formFieldsCreate: FormField[] = [
    { key: "reference_code", label: "Código de Referencia", type: "text", required: true },
    { key: "observation", label: "Observación", type: "text", required: false, className: "col-span-2" },
    { key: "customer_identification", label: "Identificación del Cliente", type: "text", required: true },
    { key: "customer_names", label: "Nombres del Cliente", type: "text", required: false },
    { key: "customer_email", label: "Email del Cliente", type: "email", required: false },
    { key: "customer_address", label: "Dirección del Cliente", type: "text", required: false },
    { key: "customer_phone", label: "Teléfono del Cliente", type: "text", required: false },
    {
      key: "customer_municipio_id",
      label: "Municipio",
      type: "select",
      required: true,
      searchable: true,
      options: municipios.map((m) => ({ label: `${m.name} (${m.department})`, value: m.id }))
    }
  ];

  // Manejar cambios en los campos de los items
  const handleItemChange = (index: number, field: string, value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  // Agregar un nuevo item
  const handleAddItem = () => {
    setItems(prev => ([
      ...prev,
      {
        code_reference: '',
        name: '',
        quantity: '1',
        price: '0',
        tax_rate: '19.00',
      }
    ]));
  };

  // Eliminar un item
  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (editingId) {
        // Lógica de actualización (mantener la existente)
        const updatePayload = {
          document: values.document,
          reference_code: values.reference_code,
          observation: values.observation,
          payment_method_code: values.payment_method_code,
          total: parseFloat(values.total),
          subtotal: parseFloat(values.subtotal),
        };
        
        await actualizarFactura(editingId, updatePayload as any);
        showSuccessToast('Factura actualizada con éxito');
      } else {
        // Crear nueva factura con múltiples items
        const createPayload: FacturaCreateRequest = {
          document: FACTURA_DEFAULTS.DOCUMENT_TYPES.FACTURA_VENTA,
          reference_code: values.reference_code,
          observation: values.observation || "",
          payment_method_code: values.payment_method_code || FACTURA_DEFAULTS.PAYMENT_METHODS.EFECTIVO,
          operation_type: FACTURA_DEFAULTS.OPERATION_TYPES.ESTANDAR,
          send_email: true,
          customer: {
            identification_document_id: FACTURA_DEFAULTS.IDENTIFICATION_DOCUMENTS.CEDULA_CIUDADANIA,
            identification: values.customer_identification,
            names: values.customer_names || "",
            address: values.customer_address || "",
            email: values.customer_email || "",
            phone: values.customer_phone || "",
            legal_organization_id: FACTURA_DEFAULTS.LEGAL_ORGANIZATIONS.PERSONA_NATURAL,
            tribute_id: FACTURA_DEFAULTS.TRIBUTES.RESPONSABLE_IVA,
            municipality_id: Number(values.customer_municipio_id),
          },
          items: items.map(item => ({
            code_reference: item.code_reference,
            name: item.name,
            quantity: parseInt(item.quantity),
            discount_rate: FACTURA_DEFAULTS.DEFAULT_FACTURA.items.discount_rate,
            price: parseFloat(item.price),
            tax_rate: item.tax_rate,
            unit_measure_id: FACTURA_DEFAULTS.UNIT_MEASURES.UNIDAD,
            standard_code_id: FACTURA_DEFAULTS.STANDARD_CODES.ESTANDAR,
            is_excluded: FACTURA_DEFAULTS.DEFAULT_FACTURA.items.is_excluded,
            tribute_id: FACTURA_DEFAULTS.DEFAULT_FACTURA.items.tribute_id,
            withholding_taxes: FACTURA_DEFAULTS.DEFAULT_FACTURA.items.withholding_taxes,
          }))
        };

        const response = await crearFactura(createPayload);
        
        if (response.status === 'success') {
          showSuccessToast('Factura creada y validada con éxito');
          if (response.data.bill.public_url) {
            window.open(response.data.bill.public_url, '_blank', 'noopener,noreferrer');
          }
        } else {
          showErrorToast(response.message || 'Error al crear la factura');
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      setItems([
        {
          code_reference: '',
          name: '',
          quantity: '1',
          price: '0',
          tax_rate: '19.00',
        },
      ]);
    } catch (error) {
      showErrorToast('Error al guardar la factura');
    }
  };

  const handleEdit = (factura: Factura & { key: React.Key }) => {
    setFormData({
      reference_code: factura.reference_code,
      observation: factura.observation || '',
      payment_method_code: factura.payment_method_code,
      customer_identification: factura.customer.identification,
      customer_names: factura.customer.names,
      customer_email: factura.customer.email,
      customer_address: factura.customer.address,
      customer_phone: factura.customer.phone,
      item_code_reference: factura.items[0]?.code_reference || '',
      item_name: factura.items[0]?.name || '',
      item_quantity: factura.items[0]?.quantity.toString() || '1',
      item_price: factura.items[0]?.price.toString() || '0',
      item_tax_rate: factura.items[0]?.tax_rate || '19.00',
    });
    // Usar el índice del array como ID para edición
    const index = facturas.findIndex(f => f.document === factura.document);
    setEditingId(index >= 0 ? index : 0);
    setIsModalOpen(true);
  };

  const handleView = async (factura: Factura & { key: React.Key }) => {
    // Usar el número de factura para buscar detalles y obtener public_url
    if (factura.number) {
      setViewingNumber(factura.number);
    } else {
      showErrorToast('No se encontró el número de factura para ver los detalles');
    }
  };

  const handleCreate = () => {
    setFormData({
      reference_code: generateReferenceCode(),
      payment_method_code: FACTURA_DEFAULTS.PAYMENT_METHODS.EFECTIVO,
      item_tax_rate: "19.00",
      item_quantity: "1",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Nueva función para manejar la descarga
  const handleDownload = (factura: Factura & { key: React.Key }) => {
    if (factura.number) {
      setDownloadingNumber(factura.number);
    } else {
      showErrorToast('No se encontró el número de factura para descargar');
    }
  };

  
  // Función para mostrar el QR de la DIAN
  const handleShowQR = async (factura: Factura & { key: string }) => {
    if (!factura.number) {
      showErrorToast('No se encontró el número de factura para mostrar el QR');
      return;
    }
    try {
      // Obtener el detalle de la factura usando la función API
      const detalle = await getFacturasVer(factura.number);
      if (detalle && detalle.bill && detalle.bill.qr) {
        window.open(detalle.bill.qr, '_blank', 'noopener,noreferrer');
        showSuccessToast('Abriendo QR de la DIAN en nueva pestaña');
      } else {
        showErrorToast('No se encontró el QR para esta factura');
      }
    } catch (error) {
      showErrorToast('Error al obtener el QR de la factura');
    }
  };

  return (
    <Layout >
      <div className="min-h-[80vh]  flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 border ">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-blue-900">Gestión de Facturas</h1>
            <Botton className=" text-white font-semibold px-6 py-2 rounded-lg shadow" onClick={handleCreate} texto="Crear Nueva Factura"/>
          </div>
          {loading ? (
            <p className="text-blue-900">Cargando facturas...</p>
          ) : (
            <div className="w-full">
              {createEntityTable({
                columns: columns as Column<any>[],
                data: facturas,
                idField: 'document',
                handlers: {
                  onEdit: handleEdit,
                  onView: handleView
                },
                options: {
                  includeEstado: false,
                  includeAcciones: false // Ya lo manejamos en la columna personalizada
                }
              })}
            </div>
          )}
        </div>
        {/* Modal para crear/editar factura */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
            setItems([
              {
                code_reference: '',
                name: '',
                quantity: '1',
                price: '0',
                tax_rate: '19.00',
              },
            ]);
          }} 
          title={editingId ? "Editar Factura" : "Crear Nueva Factura"}
        >
          <Form
            fields={formFieldsCreate}
            onSubmit={handleSubmit}
            buttonText={editingId ? "Actualizar" : "Crear"}
            initialValues={formData}
          />
          {/* Renderizar los items dinámicos */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-900">Productos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 relative bg-blue-50">
                  <button type="button" onClick={() => handleRemoveItem(idx)} className="absolute top-2 right-2 text-red-600 font-bold">&times;</button>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-blue-900">Código del Producto</label>
                    <input type="text" className="input input-bordered w-full" value={item.code_reference} onChange={e => handleItemChange(idx, 'code_reference', e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-blue-900">Nombre del Producto</label>
                    <input type="text" className="input input-bordered w-full" value={item.name} onChange={e => handleItemChange(idx, 'name', e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-blue-900">Cantidad</label>
                    <input type="number" className="input input-bordered w-full" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} required min="1" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-blue-900">Precio Unitario</label>
                    <input type="number" className="input input-bordered w-full" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} required min="0" step="0.01" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-blue-900">Tasa de Impuesto (%)</label>
                    <input type="text" className="input input-bordered w-full" value={item.tax_rate} onChange={e => handleItemChange(idx, 'tax_rate', e.target.value)} required />
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddItem} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow">Agregar producto</button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Facturas;


