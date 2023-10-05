export enum Environments {
    Dev = 'dev',
    Stage = 'stage',
    QA = 'QA',
    Prod = 'prod'
}

export enum StatusCodes {
  Success = 200,
  InvalidRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalError = 500
}

export enum Databases {
  Elig = 'eligibility',
  Medical = 'medical'
}

export enum DbText {
  NotFoundIdentifier = 'Record not found',
  EmptyEid = 'EID is required and cannot be empty.',
  EmptyRequireParameter = 'EID, External Identifier and Type parameters are required and cannot be empty.',
  EmptySecretMysql = 'Could not retrieve the secrets for connection to mysql',
  NotFoundDB = 'Database is not exist'
}

export enum ClientResponseMessages {
  Unauthorized = "Unauthorized",
  InternalError = "Internal Server Error"
}