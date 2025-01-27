import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '../environments/environment';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // Inject the current `AuthService` and use it to get an authentication token:
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Api-Key', environment.apiKey),
  });
  console.log('Intercepted HTTP request', newReq);
  return next(newReq);
}
