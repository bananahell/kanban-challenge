const auth_credentialsTaken: string = 'Credentials taken!';
const auth_emailNotFound: string = 'Email not found in database!';
const auth_incorrectPassword: string = 'Incorrect password!';

export class ErrorMessages {
  static get auth_credentialsTaken() {
    return auth_credentialsTaken;
  }
  static get auth_emailNotFound() {
    return auth_emailNotFound;
  }
  static get auth_incorrectPassword() {
    return auth_incorrectPassword;
  }
}
