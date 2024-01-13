"use client";

import React from "react";

import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { AssetJobFormSchema } from "../asset-job-form-schema";
import { saveAssetJob } from "@/lib/actions";

type Inputs = z.infer<typeof AssetJobFormSchema>;

//TODO: move to lib
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
    last_invoked: null,
    repo_fs_path: null,
    repo_geo_type: "geographix",
    repo_name: null,
    repo_id: repos[0].id,
  };

  const form = useForm<Inputs>({
    resolver: zodResolver(AssetJobFormSchema),
    defaultValues: defaults,
  });

  // START HERE
  // let watchedGeoType = useWatch({
  //   control: form.control,
  //   name: "geo_type",
  //   defaultValue: geotypes[0],
  // });

  // add repo fs_path and name here (joins not supported for sb subscription)
  const processForm: SubmitHandler<Inputs> = async (formData) => {
    console.log("PROCESSFORM", formData);
    const repo = repos.filter((r) => r.id === formData.repo_id)[0];

    formData.repo_fs_path = repo.fs_path;
    formData.repo_geo_type = repo.geo_type!;
    formData.repo_name = repo.name;
    const result = await saveAssetJob(formData);

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
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(processForm)}
            className=" space-y-6 "
          >
            <div className="flex flex-row gap-2">
              {/* ---------- */}

              <div className="w-1/12">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        {/* <div className="flex h-9 items-center justify-center"> */}
                        <div className="flex h-9 items-center ml-4">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      {/* <FormDescription>(default on)</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-1/6">
                <FormField
                  control={form.control}
                  name="repo_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <FormDescription>Source project</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-1/6">
                <FormField
                  control={form.control}
                  name="asset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <FormDescription>Data type to collect</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div className="w-1/6">
                <FormField
                  control={form.control}
                  name="chunk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>chunk</FormLabel>
                      <FormControl>
                        <Input placeholder="chunk" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              <div className="w-2/6">
                <FormField
                  control={form.control}
                  name="filter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>filter</FormLabel>
                      <FormControl>
                        <Input placeholder="filter" {...field} />
                      </FormControl>
                      <FormDescription>SQL where clause stub</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div className="flex basis-1/6">
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
            </div> */}

              <div className="w-1/6 mt-8">
                <Button type="submit" className="purr-button">
                  save job
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
