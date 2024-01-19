"use client";

import React from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

import { saveAssetJob } from "@/lib/actions";
import { toast } from "sonner";
import { ASSETS } from "@/lib/purr_utils";
import { AssetJobFormSchema } from "../asset-job-form-schema";
import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

type FormInputs = z.infer<typeof AssetJobFormSchema>;

export default function AssetJobForm({ repos }: { repos: Repo[] }) {
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

  const form = useForm<FormInputs>({
    resolver: zodResolver(AssetJobFormSchema),
    defaultValues: defaults,
  });

  // START HERE
  // let watchedGeoType = useWatch({
  //   control: form.control,
  //   name: "geo_type",
  //   defaultValue: geotypes[0],
  // });

  // we add repo fs_path and name here (joins not supported in subscription)
  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    const repo = repos.filter((r) => r.id === formData.repo_id)[0];
    formData.repo_fs_path = repo.fs_path;
    formData.repo_geo_type = repo.geo_type!;
    formData.repo_name = repo.name;
    const result = await saveAssetJob(formData);

    if (!result) {
      toast.error("No results returned when trying to save AssetJob");
      return;
    }

    if (result.error) {
      toast.error(JSON.stringify(result.error, null, 2));
      return;
    }

    toast.info(JSON.stringify(result.data, null, 2));
    form.reset();
  };

  const cardDesc = `
  Define an Asset collection job for a specific Repo. The optional filter
  creates a SQL "WHERE" clause to limit results.`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Jobs</CardTitle>
        <CardDescription>{cardDesc}</CardDescription>
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
                        <div className="flex h-9 items-center ml-4">
                          <Checkbox
                            className="h-8 w-8"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </FormControl>
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
