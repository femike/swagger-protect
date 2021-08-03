import { IsNotEmpty } from 'class-validator'

/**
 * Login DTO request
 */
export class SwaggerProtectLogInDto {
  @IsNotEmpty()
  login: string

  @IsNotEmpty()
  password: string
}
