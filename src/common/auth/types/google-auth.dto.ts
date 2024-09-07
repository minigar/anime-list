export class GoogleProfileDto {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
}
