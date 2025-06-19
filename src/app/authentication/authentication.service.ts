import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  protected userRegisteredList: User[] = [
    {
      id: 1,
      name: 'user first',
      email: 'user@mail.com',
    },
    {
      id: 2,
      name: 'user second',
      email: 'user@user.com',
    },
  ];

  getUserByEmail(email: String): User | undefined {
    return this.userRegisteredList.find(
      (registeredUser) => email === registeredUser.email
    );
  }

  postNewUser(user: User, password: String): number {
    if (
      this.userRegisteredList.some(
        (registered) => registered.email == user.email
      )
    ) {
      return -1;
    }

    user.id = 1 + Math.max(...this.userRegisteredList.map((user) => user.id));

    this.userRegisteredList.push(user);

    return user.id;
  }
}
