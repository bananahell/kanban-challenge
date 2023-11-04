export enum ErrorMessages {
  AuthCredentialsTaken = 'Credentials taken!',
  AuthEmailNotFound = 'Email not found in database!',
  AuthIncorrectPassword = 'Incorrect password!',
  ResourceNotFound = 'Resource not found!',
  NotAllowedToEdit = 'User not allowed to edit resource!',
  NotAllowedToDelete = 'User not allowed to delete resource!',
  CantRemoveOwnerUser = 'Owner cannot remove self from board users!',
  CantPassOwnerToOwner = 'Ownership cannot be passed to owner!',
  UserNotInBoard = 'Cannot see boards in which user is not working in!',
}
