"use client";

import React from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { enqueueRepoReconTask } from "@/lib/actions";
import { toast } from "sonner";
import { SUITES } from "@/lib/purr_utils";
import { SuiteUI } from "@/lib/purr_ui";
import { RepoReconFormSchema } from "./repo-recon-form-schema";
import AuxGeographix from "./aux-geographix";
import AuxKingdom from "./aux-kingdom";
import { RepoTable } from "./repo-table";

import { ArrowDownLeftSquare } from "lucide-react";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

type FormInputs = z.infer<typeof RepoReconFormSchema>;

export default function Repos({
  workers,
  repos,
}: {
  workers: string[];
  repos: Repo[];
}) {
  // 2024-01-18 | just skip state and reset to defaults after submit
  //const [data, setData] = React.useState<FormInputs>();

  const [showForm, setShowForm] = React.useState<boolean>(false);

  let defaults = {
    suite: SUITES[0],
    recon_root: "",
    worker: workers[0],
    ggx_host: "",
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(RepoReconFormSchema),
    defaultValues: defaults,
    mode: "onChange",
  });

  let watchedSuite = useWatch({
    control: form.control,
    name: "suite",
    defaultValue: SUITES[0],
  });

  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    const { data, error } = await enqueueRepoReconTask(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.info(data);
    }

    form.reset();
  };

  //TODO: add details how-to if repos is empty

  const repoFormDesc = `
  Recursively crawl directories to locate and collect metadata inventories 
  for project repositories (repos). `;

  return (
    <div>
      <Collapsible open={showForm} onOpenChange={setShowForm}>
        <CollapsibleTrigger asChild>
          <div className="flex mb-4 justify-between">
            <div className="place-self-center purr-h1">repo recon</div>
            <Button className="purr-button">
              <ArrowDownLeftSquare className="mx-2" />
              Discover Projects on your Network...
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardDescription>{repoFormDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(processForm)}
                  className=" space-y-6 "
                >
                  <div className="flex flex-row gap-2">
                    {/* ---------- */}

                    <div className="w-2/12">
                      <FormField
                        control={form.control}
                        name="suite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Repo Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a suite" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SUITES.map((gt: string) => {
                                  return (
                                    <SelectItem key={gt} value={gt}>
                                      <div className="flex items-center gap-1">
                                        {SuiteUI[gt].icon}
                                        {SuiteUI[gt].label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ---------- */}

                    <div className="w-5/12">
                      <FormField
                        control={form.control}
                        name="recon_root"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Repo Parent Directory</FormLabel>
                            <FormControl>
                              <Input placeholder="recon root" {...field} />
                            </FormControl>
                            <FormDescription>
                              UNC or drive letter path
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ---------- */}

                    <div className="w-2/12">
                      <FormField
                        control={form.control}
                        name="worker"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Worker</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a hostname" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {workers.map((hostname: string) => {
                                  return (
                                    <SelectItem key={hostname} value={hostname}>
                                      {hostname}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Assign a specific worker
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ---------- */}

                    <div className="w-1/12 mt-8 ml-10">
                      <Button type="submit" className="purr-button">
                        repo recon
                      </Button>
                    </div>
                    {/* <div className="w-1/12"></div> */}
                  </div>

                  {watchedSuite === "geographix" && (
                    <AuxGeographix form={form} />
                  )}
                  {watchedSuite === "kingdom" && <AuxKingdom form={form} />}
                </form>
              </Form>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="my-6" />

      <RepoTable repos={repos} setValue={form.setValue} />
    </div>
  );
}
