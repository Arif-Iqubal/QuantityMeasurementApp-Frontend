import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("🔥 Interceptor triggered for:", req.url);

  const token = localStorage.getItem('token');

  if (token) {
    // console.log("✅ Token found:", token);

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log("❌ No token found");
  }

  return next(req);
};