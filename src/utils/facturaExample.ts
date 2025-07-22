// Datos de ejemplo para crear facturas según la documentación de Factus
import { FacturaCreateRequest } from "@/types/Facturas";

export const FACTURA_EXAMPLE: FacturaCreateRequest = {
  document: "01",
  numbering_range_id: 4,
  reference_code: "fact0022025",
  observation: "Factura de prueba",
  payment_method_code: "10",
  customer: {
    identification: "123456789",
    dv: "3",
    company: "",
    trade_name: "",
    names: "Alan Turing",
    address: "calle 1 # 2-68",
    email: "alanturing@enigmasas.com",
    phone: "1234567890",
    legal_organization_id: 2,
    tribute_id: 21,
    identification_document_id: 3,
    municipality_id: 980
  },
  items: [
    {
      code_reference: "12345",
      name: "producto de prueba",
      quantity: 1,
      discount_rate: 20,
      price: 50000,
      tax_rate: "19.00",
      unit_measure_id: 70,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [
        {
          code: "06",
          withholding_tax_rate: 7.38
        },
        {
          code: "05",
          withholding_tax_rate: 15.12
        }
      ]
    },
    {
      code_reference: "54321",
      name: "producto de prueba 2",
      quantity: 1,
      discount_rate: 0,
      price: 50000,
      tax_rate: "5.00",
      unit_measure_id: 70,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: []
    }
  ]
};

// Función para crear datos de ejemplo simplificados
export function createExampleFacturaData(): Partial<FacturaCreateRequest> {
  return {
    document: "01",
    reference_code: `FACT${Date.now()}`,
    observation: "Factura de ejemplo",
    payment_method_code: "10",
    customer: {
      identification_document_id: 3,
      identification: "123456789",
      names: "Cliente Ejemplo",
      address: "Calle Ejemplo #123",
      email: "cliente@ejemplo.com",
      phone: "3001234567",
      legal_organization_id: 2,
      tribute_id: 21,
      municipality_id: 980
    },
    items: [
      {
        code_reference: "PROD001",
        name: "Producto de ejemplo",
        quantity: 1,
        discount_rate: 0,
        price: 100000,
        tax_rate: "19.00",
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: []
      }
    ]
  };
} 