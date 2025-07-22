import axios from 'axios';

// Cliente axios específico para peticiones de autenticación
const authApi = axios.create({
  baseURL: 'https://api-sandbox.factus.com.co',
});

// Credenciales fijas de la aplicación
const FIXED_CREDENTIALS = {
  grant_type: 'password',
  clientId: '9e3096ee-4b3a-4069-b25d-1d1ec3cb008f',
  clientSecret: 'Tvx8NERj3XIb52q0JyGw8SNzuU6uUjL2q0O70Jei',
};

/**
 * Realiza el inicio de sesión en la API de Factus
 * @param username Nombre de usuario
 * @param password Contraseña
 * @returns Token de acceso para usar en las peticiones a la API
 */
export const login = async ({
  username,
  password,
  grant_type = FIXED_CREDENTIALS.grant_type,
  clientId = FIXED_CREDENTIALS.clientId,
  clientSecret = FIXED_CREDENTIALS.clientSecret,
}: {
  username: string;
  password: string;
  grant_type?: string;
  clientId?: string;
  clientSecret?: string;
}) => {
  try {
    console.log('Intentando autenticar con usuario:', username);
    
    const res = await authApi.post('/oauth/token', {
      grant_type,
      client_id: clientId,
      client_secret: clientSecret,
      username,
      password,
    });
    
    // Registrar información de la respuesta para depuración
    console.log("Autenticación exitosa. Estado:", res.status);
    
    if (!res.data.access_token) {
      console.error("Error: No se recibió token de acceso en la respuesta", res.data);
      throw new Error("No se recibió token de acceso");
    }
    
    // Configurar el token en los encabezados predeterminados de axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;

    // Guardar el token y la información del usuario en el almacenamiento local
    const token = res.data.access_token;
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify({ username }));
    
    return token;
  } catch (error: any) {
    console.error("Error durante la autenticación:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error_description || error.response?.data?.message || error.message || "Error de autenticación");
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  // Eliminar el token de los encabezados
  delete axios.defaults.headers.common['Authorization'];
  
  // Eliminar el token y la información del usuario del almacenamiento local
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

/**
 * Verifica si el usuario está autenticado
 * @returns true si el usuario está autenticado, false en caso contrario
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};
