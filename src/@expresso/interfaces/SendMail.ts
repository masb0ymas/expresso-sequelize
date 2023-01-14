interface BaseSendMailEntity {
  email: string
  fullname: string
}

export interface AccountRegistrationEntity extends BaseSendMailEntity {
  token: string
}
