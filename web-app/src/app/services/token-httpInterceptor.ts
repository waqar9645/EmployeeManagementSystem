import { HttpInterceptorFn } from "@angular/common/http";

export const tokenHttpInterceptor : HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    console.log(token);
    req = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return next(req);
  };