/**
 * Verifica si existe un token válido en el localStorage
 * @returns true si existe un token, false en caso contrario
 */
export const hasValidToken = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * Obtiene el token de acceso del localStorage
 * @returns El token de acceso o null si no existe
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * Verifica si el token ha expirado (implementación básica)
 * En una aplicación real, deberías verificar la expiración del JWT
 * @returns true si el token es válido, false si ha expirado
 */
export const isTokenExpired = (): boolean => {
  const token = getAccessToken();
  if (!token) return true;

  try {
    // Decodificar el JWT para obtener la información de expiración
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error al verificar la expiración del token:', error);
    return true; // Si hay error, consideramos el token como expirado
  }
};

/**
 * Verifica si el token es válido y no ha expirado
 * @returns true si el token es válido y no ha expirado
 */
export const isTokenValid = (): boolean => {
  return hasValidToken() && !isTokenExpired();
}; 