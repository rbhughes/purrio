"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { SUITES } from "@/lib/purr_utils";
import { SuiteUI } from "@/lib/purr_ui";
import { RepoReconFormSchema } from "./repo-recon-form-schema";
import { ArrowDownLeftSquare } from "lucide-react";

///

import { createClient } from "@/utils/supabase/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import RepoVis from "./repo-vis";

///

import { enqueueRepoReconTask } from "@/lib/actions";
import AuxGeographix from "./aux-geographix";
import AuxKingdom from "./aux-kingdom";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];
type FormInputs = z.infer<typeof RepoReconFormSchema>;

const renderSubComponent = ({ row }: { row: any }) => {
  return <RepoVis repo={row.original as Repo} />;
};

export default function Repos({ workers }: { workers: string[] }) {
  const supabase = createClient();

  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [repos, setRepos] = React.useState<Repo[]>([]);

  const getRepos = async () => {
    const { data, error } = await supabase
      .from("repo")
      .select()
      .order("updated_at", { ascending: false });

    if (!data) {
      return;
    } else {
      setRepos(data);
      ///console.log(data);
    }
    if (error) {
      console.error(error);
      return;
    }
  };

  React.useEffect(() => {
    getRepos();

    const channel = supabase
      .channel("realtime repos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repo",
        },

        async (payload: any) => {
          getRepos();
          let newRepo: Repo = payload.new;
          setRepos((prev) => [newRepo, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
  Define a network path (drive letter or UNC) for a parent folder that contains
  project repositories`;

  //<div className="bg-red-100 text-center purr-h1 ">repo recon</div>
  return (
    <div>
      <Collapsible open={showForm} onOpenChange={setShowForm}>
        <div className="flex flex-row mb-4">
          <div className="w-2/6"></div>
          <div className="w-2/6 flex justify-center purr-h1">repo recon</div>
          <div className="w-2/6 flex justify-end">
            <CollapsibleTrigger asChild>
              <Button variant="secondary">
                <ArrowDownLeftSquare className="mx-2 bg-yellow-400 text-orange-500" />
                Discover Projects on your Network...
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <div className="flex justify-center mb-4 font-mono italic mt-1">
          Locate and collect metadata inventories from network projects
        </div>

        <CollapsibleContent>
          <Card className="shadow-xl mx-10">
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

                    <div className="w-2/12 ">
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
                                      {/* <div className="flex items-center h-fit w-fit">
                                        <span className="text-2xl font-black">
                                          &#x26C1;
                                        </span>
                                        <span className="pl-1">GeoGraphix</span>
                                      </div> */}

                                      <div className="flex items-center gap-1">
                                        {SuiteUI[gt].icon}
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

                    <div className="w-8/12">
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

                    {/* <div className="w-2/12">
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
                    </div> */}

                    {/* ---------- */}

                    <div className="w-2/12 mt-8 ">
                      <Button
                        type="submit"
                        className="purr-form-button"
                        variant="secondary"
                      >
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

      {Object.keys(form.control._formState.errors).length > 0 && (
        <div className="bg-red-400">
          {JSON.stringify(form.control._formState.errors)}
        </div>
      )}

      <div className="mt-20" />

      <DataTable
        data={repos}
        columns={columns}
        renderSubComponent={renderSubComponent}
        getRowCanExpand={() => true}
      />
    </div>
  );
}
