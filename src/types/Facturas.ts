// Tipo para crear/validar factura según la documentación de Factus
export interface FacturaCreateRequest {
  numbering_range_id?: number;
  document?: string;
  reference_code: string;
  observation?: string;
  payment_form?: {
    code: string;
  };
  payment_due_date?: string;
  payment_method_code?: string;
  operation_type?: string;
  order_reference?: {
    reference_code: string;
    issue_date?: string;
  };
  send_email?: boolean;
  related_documents?: Array<{
    code: string;
    issue_date: string;
    number: string;
  }>;
  billing_period?: {
    start_date: string;
    start_time?: string;
    end_date: string;
    end_time: string;
  };
  customer: {
    identification_document_id: number;
    identification: string;
    dv?: string;
    company?: string;
    trade_name?: string;
    names?: string;
    address?: string;
    email?: string;
    phone?: string;
    legal_organization_id: number;
    tribute_id: number;
    municipality_id?: number;
  };
  items: Array<{
    scheme_id?: string;
    note?: string;
    code_reference: string;
    name: string;
    quantity: number;
    discount_rate: number;
    price: number;
    tax_rate: string;
    unit_measure_id: number;
    standard_code_id: number;
    is_excluded: number;
    tribute_id: number;
    withholding_taxes: Array<{
      code: string;
      withholding_tax_rate: number;
    }>;
    mandate?: {
      identification_document_id: number;
      identification: string;
    };
  }>;
}

// Tipo para la respuesta de creación/validación de factura
export interface FacturaCreateResponse {
  status: string;
  message: string;
  data: {
    bill: {
      id: number;
      number: string;
      reference_code: string;
      status: number;
      validated: string;
      public_url: string;
      qr: string;
      cufe: string;
      created_at: string;
    };
  };
}

// Tipo para la factura en la lista (simplificado)
export interface Factura {
  number?: string;
  public_url?: string;
  document: string;
  numbering_range_id: number;
  reference_code: string;
  observation: string;
  payment_method_code: string;
  customer: {
    identification: string;
    dv: string;
    company: string;
    trade_name: string;
    names: string;
    address: string;
    email: string;
    phone: string;
    legal_organization_id: string;
    tribute_id: string;
    identification_document_id: number;
    municipality_id: string;
  };
  items: {
    code_reference: string;
    name: string;
    quantity: number;
    discount_rate: number;
    price: number;
    tax_rate: string;
    unit_measure_id: number;
    standard_code_id: number;
    is_excluded: number;
    tribute_id: string;
    withholding_taxes: {
      code: string;
      withholding_tax_rate: number;
    }[];
  }[];
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  total_withholding_taxes: number;
  total_withholding_taxes_amount: number;
}

// Tipo para la respuesta de descarga de PDF de factura
export type FacturaDescargaPDFResponse =
  | {
      status?: string;
      message?: string;
      file_name: string;
      pdf_base_64_encoded: string;
    }
  | {
      status: string;
      message: string;
      data: {
        file_name: string;
        pdf_base_64_encoded: string;
      };
    };
