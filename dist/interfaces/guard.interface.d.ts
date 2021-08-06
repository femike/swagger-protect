export interface SwaggerGuardInterface {
    canActivate(token: string): Promise<boolean>;
}
