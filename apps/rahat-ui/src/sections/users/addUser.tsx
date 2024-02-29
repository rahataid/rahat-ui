import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';

export default function AddUser() {
  return (
    <div className="p-4">
      <h1 className="text-md font-semibold mb-6">Add User</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input type="text" placeholder="Name" />
        <Input type="email" placeholder="Email" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="user">USER</SelectItem>
              <SelectItem value="admin">ADMIN</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input type="text" placeholder="Wallet Address" />
      </div>
      <div className="flex justify-end">
        <Button>Create User</Button>
      </div>
    </div>
  );
}
