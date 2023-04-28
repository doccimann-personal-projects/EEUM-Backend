export class LoginUserResponse {
  jwtToken: string;

  constructor(jwtToken: string) {
    this.jwtToken = jwtToken;
  }
}
