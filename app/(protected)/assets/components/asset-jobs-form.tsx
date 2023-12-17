"use client";

import React from "react";

import Link from "next/link";

import { useForm, useWatch, SubmitHandler } from "react-hook-form";

import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];
type Repo = Database["public"]["Tables"]["repo"]["Row"];

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
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";

import { AssetJobFormSchema } from "../asset-job-form-schema";
type Inputs = z.infer<typeof AssetJobFormSchema>;

const ASSETS = [
  "core",
  "dst",
  "formation",
  "ip",
  "perforation",
  "production",
  "raster_log",
  "survey",
  "vector_log",
  "well",
  "zone",
];

export function AssetJobForm({ repos }: { repos: Repo[] }) {
  const [data, setData] = React.useState<Inputs>();

  let defaults = {
    active: true,
    asset: ASSETS[0],
    chunk: 100,
    cron: "",
    filter: "",
    repo_id: repos[0].id,
  };

  const form = useForm<Inputs>({
    resolver: zodResolver(AssetJobFormSchema),
    defaultValues: defaults,
  });

  const processForm: SubmitHandler<Inputs> = async (formData) => {
    console.log(formData);
    //const result = await addRepoReconTask(formData);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)} className=" space-y-6 ">
          <div className="flex flex-row">
            <div className="flex basis-1/6">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>active</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>This is active</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex basis-1/6">
              <FormField
                control={form.control}
                name="repo_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>repo_id</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a repo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {repos.map((repo: Repo) => {
                          return (
                            <SelectItem key={repo.id} value={repo.id}>
                              {repo.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Yay assets{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex basis-1/6">
              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>asset</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ASSETS.map((asset: string) => {
                          return (
                            <SelectItem key={asset} value={asset}>
                              {asset}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Yay assets{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex basis-1/6">
              <FormField
                control={form.control}
                name="chunk"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>chunk</FormLabel>
                    <FormControl>
                      <Input placeholder="chunk" {...field} />
                    </FormControl>
                    <FormDescription>This is chunk</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex basis-1/6">
              <FormField
                control={form.control}
                name="filter"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>filter</FormLabel>
                    <FormControl>
                      <Input placeholder="filter" {...field} />
                    </FormControl>
                    <FormDescription>This is filter</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex basis-1/6">
              <FormField
                control={form.control}
                name="cron"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>cron</FormLabel>
                    <FormControl>
                      <Input placeholder="cron" {...field} />
                    </FormControl>
                    <FormDescription>This is cron</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
