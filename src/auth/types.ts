export interface AuthQueryObject {
  code: string,
  timestamp: string,
  state: string,
  shop: string,
  hmac?: string
}