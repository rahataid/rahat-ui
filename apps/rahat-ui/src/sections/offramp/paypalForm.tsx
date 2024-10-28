import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function PaypalForm() {
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 characters' }),
    location: z.string(),
    phone: z.string(),
    governmentID: z.string().optional(),
    photo: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      location: '',
      governmentID: '',
      phone: '',
      photo: '',
    },
  });

  return (
    <div className="border rounded-md mx-2 my-4 p-6">
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label
                    className="font-inter text-[14px] font-semibold  text-left
"
                  >
                    Name
                  </Label>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Field */}
            <FormField
              name="location"
              render={({ field }) => (
                <FormItem>
                  <Label
                    className="font-inter text-[14px] font-semibold  text-left
"
                  >
                    Location
                  </Label>
                  <FormControl>
                    <Input {...field} placeholder="Enter your location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <Label
                    className="font-inter text-[14px] font-semibold  text-left
"
                  >
                    Phone Number
                  </Label>
                  <FormControl>
                    <PhoneInput {...field} placeholder="Enter phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Government ID Field */}
            <FormField
              name="governmentID"
              render={({ field }) => (
                <FormItem>
                  <Label
                    className="font-inter text-[14px] font-semibold  text-left
"
                    htmlFor="governmentID"
                  >
                    Government ID
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your government ID number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attach Photo Field */}
            <FormField
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <Label
                    className="font-inter text-[14px] font-semibold  text-left
"
                    htmlFor="photo"
                  >
                    Attach Photo
                  </Label>
                  <FormControl>
                    <Input {...field} type="file" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="button">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
