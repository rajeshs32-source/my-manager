export class AuthRequestDto {
  username: string;
  password: string;
}

export class SignupRequestDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  addressline1: string;
  addressline2: string;
  city: string;
  postalCode: string;
  termsAndCondChecked: boolean;
  accessType: string;
}

export class EventDetailsDto {
  name: string;
  date: string;
  city: string;
}
