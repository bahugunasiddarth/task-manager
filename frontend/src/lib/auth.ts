export const fetchWithAuth = async (url: string, options: any = {}) => {
  let token = localStorage.getItem('accessToken');
  
  let res = await fetch(url, {
    ...options,
    headers: { 
      'Content-Type': 'application/json',
      ...options.headers, 
      Authorization: `Bearer ${token}` 
    }
  });

  if (res.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      window.location.href = '/';
      return res;
    }

    // Call your backend refresh endpoint
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem('accessToken', data.accessToken);
      
      // Retry the original request with the new token
      res = await fetch(url, {
        ...options,
        headers: { 
          'Content-Type': 'application/json',
          ...options.headers, 
          Authorization: `Bearer ${data.accessToken}` 
        }
      });
    } else {
      // Refresh failed (e.g., token expired), force re-login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  }
  return res;
};