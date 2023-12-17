"use client";

import React from "react";

import Link from "next/link";

import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Button } from "@/components/ui/button";

import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

import { RepoReconFormSchema } from "../repo-recon-form-schema";
//import { addRepoReconTask } from "./server-actions";
import { addRepoReconTask } from "@/lib/actions";

import { AuxGeographix } from "./AuxGeoGraphix";
import { AuxKingdom } from "./AuxKingdom";

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
    // console.log("____top of processForm______(written to BROWSER)__");
    // console.log(formData);
    // console.log("__________________________________________________");
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

    toast({
      className: "w-[700px]",
      title: result.data.recon_root,
      description: (
        <pre className="mt-2 w-[650px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(result.data, null, 2)}
          </code>
        </pre>
      ),
    });

    setData(result.data);
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)} className=" space-y-6 ">
          {/* ---------- */}

          <div className="flex flex-row">
            <div className="flex basis-1/4">
              <FormField
                control={form.control}
                name="geo_type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>geo_type</FormLabel>
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
                    <FormDescription>
                      Yay geotypes{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex basis-2/4">
              <FormField
                control={form.control}
                name="recon_root"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Repo Recon</FormLabel>
                    <FormControl>
                      <Input placeholder="recon root" {...field} />
                    </FormControl>
                    <FormDescription>This is a recon root</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex basis-1/4">
              <FormField
                control={form.control}
                name="hostname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>hostname</FormLabel>
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
                    <FormDescription>
                      assigned hostname for task
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="flex basis-1/4">
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
            <div className="flex basis-2/4"></div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <Toaster />
    </>
  );
}
