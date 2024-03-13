"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@rahat-ui/shadcn/src/components/ui/form";
import { Input } from "@rahat-ui/shadcn/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@rahat-ui/shadcn/src/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { z } from "zod";
import { useRumsanService } from "../../providers/service.provider";
import {
  BankedStatus,
  InternetStatus,
  PhoneStatus,
} from "@rahataid/community-tool-sdk/enums/";
import React, { useEffect } from "react";

import { Textarea } from "@rahat-ui/shadcn/src/components/ui/textarea";
import { ListBeneficiary } from "@rahataid/community-tool-sdk/beneficiary";

export default function EditBeneficiary({ data }: { data: ListBeneficiary }) {
  const { communityBenQuery } = useRumsanService();
  const benefClient = communityBenQuery.useCommunityBeneficiaryUpdate();

  const FormSchema = z.object({
    phone: z.string(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    notes: z.string().optional(),

    bankedStatus: z.string().toUpperCase().optional(),
    internetStatus: z.string().toUpperCase().optional(),
    phoneStatus: z.string().toUpperCase().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: data?.phone || "",
      bankedStatus: data?.bankedStatus || "",
      internetStatus: data?.internetStatus || "",
      phoneStatus: data?.phoneStatus || "",
      location: data?.location || "",
      latitude: data?.latitude || 0,
      longitude: data?.longitude || 0,
      notes: data?.notes || "",
    },
  });

  const handleEditBeneficiary = async (
    formData: z.infer<typeof FormSchema>
  ) => {
    await benefClient.mutateAsync({ uuid: data.uuid, payload: formData });
  };

  useEffect(() => {
    if (benefClient.isSuccess) {
      form.reset();
    }
  }, [benefClient.isSuccess, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
        <div className="p-4 h-add">
          <h1 className="text-lg font-semibold mb-6">Update Beneficiary</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Phone"
                          {...field}
                          onChange={(e) => {
                            form.setValue("phone", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="bankedStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Banked Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={BankedStatus.BANKED}>
                            Banked
                          </SelectItem>
                          <SelectItem value={BankedStatus.UNDER_BANKED}>
                            Under Banked
                          </SelectItem>
                          <SelectItem value={BankedStatus.UNBANKED}>
                            UnBanked
                          </SelectItem>
                          <SelectItem value={BankedStatus.UNKNOWN}>
                            Unknown
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="internetStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Internet Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={InternetStatus.MOBILE_INTERNET}>
                            Mobile Internet
                          </SelectItem>
                          <SelectItem value={InternetStatus.NO_INTERNET}>
                            No Internet
                          </SelectItem>
                          <SelectItem value={InternetStatus.HOME_INTERNET}>
                            Home Internet
                          </SelectItem>
                          <SelectItem value={InternetStatus.UNKNOWN}>
                            Unknown
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phoneStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Phone Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PhoneStatus.SMART_PHONE}>
                            Smart Phone
                          </SelectItem>
                          <SelectItem value={PhoneStatus.NO_PHONE}>
                            No Phone
                          </SelectItem>
                          <SelectItem value={PhoneStatus.FEATURE_PHONE}>
                            Feature Phone
                          </SelectItem>
                          <SelectItem value={PhoneStatus.UNKNOWN}>
                            Unknown
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="float"
                          placeholder="Longitude"
                          {...field}
                          onChange={(e) => {
                            const numericValue = parseFloat(e.target.value);
                            form.setValue("longitude", numericValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="float"
                          placeholder="Latitude"
                          {...field}
                          onChange={(e) => {
                            const numericValue = parseFloat(e.target.value);
                            form.setValue("latitude", numericValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button>Update Beneficiary</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
