import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

const profileData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@rahat.io',
  phoneNumber: 9801234567,
  address: 'Sanepa, Lalitpur',
};

export default function ProfileView() {
  return (
    <div className="mt-8">
      <p className="text-3xl font-semibold">Profile Detail</p>
      <Card className="mt-8 shadow-md bg-secondary">
        <CardHeader>
          <CardTitle>
            {profileData.firstName.concat(' ', profileData.lastName)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-4 flex-wrap">
            <div>
              <p>{profileData.firstName}</p>
              <p className="text-sm font-light">First Name</p>
            </div>
            <div>
              <p>{profileData.lastName}</p>
              <p className="text-sm font-light">Last Name</p>
            </div>
            <div>
              <p>{profileData.email}</p>
              <p className="text-sm font-light">Email</p>
            </div>
            <div>
              <p>{profileData.phoneNumber}</p>
              <p className="text-sm font-light">Phone Number</p>
            </div>
            <div>
              <p>{profileData.address}</p>
              <p className="text-sm font-light">Address</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
