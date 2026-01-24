import { ClientSafeProvider } from 'next-auth/react'
import { Session } from 'next-auth'

export type ServiceAccount = {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

type UserType = {
  id: string
  name: string
  email: string
  image: string
  emailVerified?: boolean
  active?: boolean
  admin?: boolean
}

type AuthState = {
  loading: boolean
  currentUser: any | null
  noAdmin: boolean
}

export type SignInProps = {
  providers: ClientSafeProvider[]
}
