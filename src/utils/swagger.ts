import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty({ example: 'T200' })
  retCode: string;

  @ApiProperty({ example: 'success' })
  retMsg: string;

  // data 的类型稍后由泛型决定
  data: T;
}

export const ApiResponseDto = <T extends new (...args: any[]) => any>(
  model: T,
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseResponse) }],
        properties: {
          data: {
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
  );
};

export const ApiResponseArrayDto = <T extends new (...args: any[]) => any>(
  model: T,
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseResponse) }],
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
        },
      },
    }),
  );
};

export const ApiSimpleResponseDto = (type: 'boolean' | 'string' | 'number') => {
  return ApiOkResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(BaseResponse) }],
      properties: {
        data: {
          type,
        },
      },
    },
  });
};
