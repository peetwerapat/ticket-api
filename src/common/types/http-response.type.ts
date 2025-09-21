import { HttpStatus } from '@nestjs/common';

import { TPagination } from './pagination.type';

export class BaseHttpResponse {
  statusCode: HttpStatus;
  message: string;

  constructor(partial: Partial<BaseHttpResponse>) {
    Object.assign(this, partial);
  }
}

export interface HttpResponseType<T> extends BaseHttpResponse {
  data?: T;
  pagination?: TPagination;
}

export class HttpResponse<T> extends BaseHttpResponse {
  data: T;
  pagination: TPagination;

  constructor({ statusCode, message, data, pagination }: HttpResponseType<T>) {
    super({ statusCode, message });
    this.data = data ?? ({} as T);

    if (pagination) {
      this.pagination = pagination;
    }
  }
}
