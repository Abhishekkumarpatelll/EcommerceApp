import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

// Define the function-based interceptor using the HttpInterceptorFn type
export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);  // Using inject to get the service instance in the function
  
  const token = localStorage.getItem('token');
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);  // Handle the request with the token
  }
  
  return next(req);  // If no token, pass the request as-is
};
