export interface JwtPayload {
  [key: string]: any;
  sub: string;
  email: string;
  id: string;
  isActive: boolean;
}
