// Valores por defecto para la creación de facturas según la documentación de Factus

export const FACTURA_DEFAULTS = {
  // Tipos de documento
  DOCUMENT_TYPES: {
    FACTURA_VENTA: "01",
    FACTURA_EXPORTACION: "02",
    FACTURA_CONTINGENCIA: "03",
  },

  // Métodos de pago
  PAYMENT_METHODS: {
    EFECTIVO: "10",
    CHEQUE: "20",
    TRANSFERENCIA: "30",
    TARJETA_CREDITO: "40",
    TARJETA_DEBITO: "50",
  },

  // Tipos de operación
  OPERATION_TYPES: {
    ESTANDAR: "10",
    MANDATOS: "11",
    AIU: "12",
  },

  // IDs de documentos de identificación
  IDENTIFICATION_DOCUMENTS: {
    CEDULA_CIUDADANIA: 3,
    CEDULA_EXTRANJERIA: 4,
    NIT: 1,
    PASAPORTE: 5,
  },

  // IDs de organizaciones legales
  LEGAL_ORGANIZATIONS: {
    PERSONA_NATURAL: 2,
    PERSONA_JURIDICA: 1,
  },

  // IDs de tributos
  TRIBUTES: {
    RESPONSABLE_IVA: 21,
    NO_RESPONSABLE_IVA: 22,
    GRAN_CONTRIBUYENTE: 23,
  },

  // IDs de unidades de medida
  UNIT_MEASURES: {
    UNIDAD: 70,
    KILOGRAMO: 1,
    LITRO: 2,
    METRO: 3,
  },

  // IDs de códigos estándar
  STANDARD_CODES: {
    ESTANDAR: 1,
  },

  // Municipios comunes
  MUNICIPALITIES: {
    BOGOTA: 980,
    MEDELLIN: 5001,
    CALI: 76001,
    BARRANQUILLA: 8001,
  },

  // Valores por defecto para crear factura
  DEFAULT_FACTURA: {
    document: "01", // Factura de venta
    payment_method_code: "10", // Efectivo
    operation_type: "10", // Estándar
    send_email: true,
    customer: {
      identification_document_id: 3, // Cédula de ciudadanía
      legal_organization_id: 2, // Persona natural
      tribute_id: 21, // Responsable de IVA
      municipality_id: 980, // Bogotá
    },
    items: {
      unit_measure_id: 70, // Unidad
      standard_code_id: 1, // Estándar
      is_excluded: 0, // No excluido de IVA
      tribute_id: 1, // IVA
      discount_rate: 0,
      withholding_taxes: [],
    }
  }
};

// Función para generar un código de referencia único
export function generateReferenceCode(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `FACT${timestamp}${random}`;
}

// Función para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar identificación colombiana
export function isValidIdentification(identification: string): boolean {
  return /^\d{8,15}$/.test(identification);
} 