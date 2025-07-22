import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/atomos";
import Select from 'react-select';

export type FormField = {
  key: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'select' | 'date' | 'file' | 'toggle';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  extraButton?: {
    icon: string;
    onClick: () => void;
    className?: string;
  };
  conditional?: (values: Record<string, any>) => boolean;
  description?: string;
  className?: string;
  onChange?: (value: any) => void;
  multiple?: boolean;
  searchable?: boolean;
};

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  buttonText?: string;
  initialValues?: Record<string, any>;
  schema?: any;
  disabled?: boolean;
}

const Form = ({ fields, onSubmit, buttonText = "Enviar", initialValues = {}, schema, disabled = false }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialValues,
  });

  const watchAllFields = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border border-blue-200 shadow-lg rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          if (field.conditional && !field.conditional(watchAllFields)) {
            return null;
          }

          const { ref, ...registerProps } = register(field.key);

          // Si el campo tiene className 'col-span-2', ocupa ambas columnas, si no, solo una
          const colSpan = field.className?.includes('col-span-2') ? 'col-span-2' : '';

          return (
            <div key={field.key} className={`space-y-2 ${colSpan}`}>
              <div className="flex items-center justify-between">
                <label htmlFor={field.key} className="block text-sm font-medium text-blue-900 dark:text-gray-200">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.extraButton && (
                  <button
                    type="button"
                    onClick={field.extraButton.onClick}
                    className={field.extraButton.className}
                  >
                    {field.extraButton.icon}
                  </button>
                )}
              </div>

              {field.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
              )}

              {field.type === "select" && field.searchable ? (
                <Select
                  inputId={field.key}
                  isMulti={field.multiple}
                  isDisabled={disabled}
                  options={field.options}
                  placeholder="Buscar..."
                  classNamePrefix="react-select"
                  value={
                    field.multiple
                      ? field.options?.filter(opt => (watchAllFields[field.key] || []).includes(opt.value))
                      : field.options?.find(opt => opt.value === watchAllFields[field.key]) || null
                  }
                  onChange={option => {
                    if (field.multiple) {
                      const values = Array.isArray(option) ? option.map(o => o.value) : [];
                      setValue(field.key, values);
                    } else {
                      setValue(field.key, option ? (option as any).value : '');
                    }
                    field.onChange && field.onChange(option);
                  }}
                  isSearchable
                />
              ) : field.type === "select" ? (
                <select
                  {...registerProps}
                  ref={ref}
                  multiple={field.multiple}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-blue-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => {
                    if (field.multiple) {
                      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                      setValue(field.key, selectedOptions);
                    } else {
                      registerProps.onChange(e);
                    }
                  }}
                  size={field.multiple ? Math.min(field.options?.length || 4, 6) : undefined}
                >
                  {!field.multiple && <option value="">Seleccione una opción</option>}
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "toggle" ? (
                <div className="mt-1">
                  
                </div>
              ) : field.type === "date" ? (
                <Input
                  type="date"
                  {...registerProps}
                  ref={ref}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-blue-200 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                <Input
                  type={field.type}
                  {...registerProps}
                  ref={ref}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-blue-200 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              )}

              {errors[field.key] && (
                <p className="mt-2 text-sm text-red-600">
                  {errors[field.key]?.message as string}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={disabled}
          className={`px-4 py-2 rounded-lg transition-colors font-semibold shadow-md ${
            disabled 
              ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
              : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default Form;
