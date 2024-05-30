import { CanActivateFn } from '@angular/router';
import { ROLE } from '../../constants/role.constant';

export const authUserGuard: CanActivateFn = (route, state) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
  if(currentUser && currentUser.role === ROLE.USER ){
    return true;
  }
  return false;
};
