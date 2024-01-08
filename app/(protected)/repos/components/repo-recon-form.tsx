"use client";

import React from "react";

import Link from "next/link";

import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RepoReconFormSchema } from "../repo-recon-form-schema";
import { addRepoReconTask } from "@/lib/actions";

import { AuxGeographix } from "./aux-geographix";
import { AuxKingdom } from "./aux-kingdom";

type Inputs = z.infer<typeof RepoReconFormSchema>;

export function RepoReconForm({
  email,
  geotypes,
  hostnames,
}: {
  email: string;
  geotypes: string[];
  hostnames: string[];
}) {
  const [data, setData] = React.useState<Inputs>();

  let defaults = {
    geo_type: geotypes[0],
    recon_root: "",
    hostname: hostnames[0],
    ggx_host: "",
  };

  const form = useForm<Inputs>({
    resolver: zodResolver(RepoReconFormSchema),
    defaultValues: defaults,
  });

  let watchedGeoType = useWatch({
    control: form.control,
    name: "geo_type",
    defaultValue: geotypes[0],
  });

  const processForm: SubmitHandler<Inputs> = async (formData) => {
    const result = await addRepoReconTask(formData);

    if (!result) {
      console.log("Something went wrong");
      return;
    }

    if (result.error) {
      // set local error state
      console.log(result.error);
      return;
    }

    setData(result.data);
    form.reset();
  };

  return (
    <div className="border border-amber-500  my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)} className=" space-y-6 ">
          {/* ---------- */}

          <div className="flex flex-row gap-2 ">
            <div className="w-1/6">
              <FormField
                control={form.control}
                name="geo_type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Repo Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a geo_type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {geotypes.map((geotype: string) => {
                          return (
                            <SelectItem key={geotype} value={geotype}>
                              {geotype}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>
                      Yay geotypes{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-2/6">
              <FormField
                control={form.control}
                name="recon_root"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Repo Recon</FormLabel>
                    <FormControl>
                      <Input placeholder="recon root" {...field} />
                    </FormControl>
                    <FormDescription>
                      Directory containing projects
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-1/6">
              <FormField
                control={form.control}
                name="hostname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Worker</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hostname" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hostnames.map((hostname: string) => {
                          return (
                            <SelectItem key={hostname} value={hostname}>
                              {hostname}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>Assign a specific worker</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-1/6"></div>
            <div className="w-1/6 mt-8">
              <Button type="submit" className="purr-button">
                Submit
              </Button>
            </div>
          </div>

          {/* {watchedGeoType === "geographix" && <AuxGeographix form={form} />}
          {watchedGeoType === "kingodm" && <AuxKingdom form={form} />} */}

          <div className="flex flex-row">
            {watchedGeoType === "geographix" && (
              <div className="w-full">
                <AuxGeographix form={form} />
              </div>
            )}
            {watchedGeoType === "kingdom" && (
              <div className="w-full">
                <AuxKingdom form={form} />
              </div>
            )}
          </div>

          {/* <Button type="submit">Submit</Button> */}
        </form>
      </Form>

      {/* <Toaster /> */}
    </div>
  );
}
