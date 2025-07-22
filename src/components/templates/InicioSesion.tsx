import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/api/auth/auth';

/**
 * Componente de inicio de sesión
 */
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Usamos las credenciales fijas para clientId y clientSecret
      await login({
        grant_type: 'password',
        clientId: '9e3096ee-4b3a-4069-b25d-1d1ec3cb008f',
        clientSecret: 'Tvx8NERj3XIb52q0JyGw8SNzuU6uUjL2q0O70Jei',
        username,
        password
      });
      // Redirigimos a la página principal de la aplicación
      navigate('/Facturas');
    } catch (err: any) {
      console.error('Error de inicio de sesión:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Ingrese su usuario"
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Ingrese su contraseña"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;