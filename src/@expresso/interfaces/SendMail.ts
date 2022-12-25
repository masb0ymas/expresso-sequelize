interface BaseSendMailEntity {
  email: string
  fullName: string
}

export interface AccountRegistrationEntity extends BaseSendMailEntity {
  token: string
}
