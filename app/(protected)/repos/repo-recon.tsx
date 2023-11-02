"use client";
import React from "react";

import Link from "next/link";

import { useForm, SubmitHandler } from "react-hook-form";
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

import { RepoReconFormSchema } from "./repo-recon-schema";
import { addEntry } from "./server-actions";

type Inputs = z.infer<typeof RepoReconFormSchema>;

export function RepoRecon({
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
    recon_root: "path somewhere",
    hostname: hostnames[0],
  };

  const form = useForm<Inputs>({
    resolver: zodResolver(RepoReconFormSchema),
    defaultValues: defaults,
    // defaultValues: {
    //   geo_type: geotypes[0],
    //   recon_root: "path somewhere",
    //   hostname: hostnames[0],
    // },
  });

  const { reset } = useForm<Inputs>({
    resolver: zodResolver(RepoReconFormSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    // console.log("____top of processForm______(written to BROWSER)__");
    // console.log(data);
    // console.log("__________________________________________________");
    const result = await addEntry(data);
    console.log(result);

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
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    reset();
    //setData(result.data);
    setData(result.data);
    //reset(defaults);
    // 2023-11-01 | reset not working? Maybe do useEffect (since controlled)
    //https://react-hook-form.com/docs/useform/reset
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className="w-2/3 space-y-6"
        >
          {/* -------- */}

          <FormField
            control={form.control}
            name="recon_root"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repo Recon</FormLabel>
                <FormControl>
                  <Input placeholder="recon root" {...field} />
                </FormControl>
                <FormDescription>This is a recon root</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* -------- */}

          <FormField
            control={form.control}
            name="geo_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>geo_type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                  You can manage email addresses in your{" "}
                  <Link href="/examples/forms">email settings</Link>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* -------- */}

          <FormField
            control={form.control}
            name="hostname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>hostname</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <FormDescription>just a form description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
}
