import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertDateFields, removePasswordField } from 'src/helpers';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data) {
          if (Array.isArray(data)) {
            data = data.map((item) => removePasswordField(item));
            return data.map(
              (item: { createdAt: number | Date; updatedAt: number | Date }) =>
                convertDateFields(item),
            );
          } else {
            data = removePasswordField(data);
            return convertDateFields(data);
          }
        }
      }),
    );
  }
}
