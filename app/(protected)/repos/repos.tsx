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

import { ArrowDownLeftSquare } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SUITES } from "@/lib/purr_utils";
import { SuiteUI } from "@/lib/purr_ui";
import { RepoReconFormSchema } from "./repo-recon-form-schema";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import AuxGeographix from "./aux-geographix";
import AuxKingdom from "./aux-kingdom";
import RepoVis from "./repo-vis";
import { Database } from "@/lib/sb_types";
import { enqueueRepoReconTask } from "@/lib/actions";

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

  return (
    <div>
      <Collapsible open={showForm} onOpenChange={setShowForm}>
        <div className="flex flex-row mb-4">
          <div className="w-1/6"></div>
          <div className="w-4/6 flex justify-center mb-4 font-mono italic mt-1 text-lg">
            Locate and collect metadata inventories from network projects
          </div>
          <div className="w-1/6 flex justify-end">
            <CollapsibleTrigger asChild>
              <Button variant="secondary">
                <ArrowDownLeftSquare className="mx-2 bg-yellow-400 text-orange-500" />
                Discover Projects on your Network...
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <Card className="rounded mx-10">
            <CardHeader>
              <CardDescription>
                Define a network path (drive letter or UNC) for a parent folder
                that contains project repositories
              </CardDescription>
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

      <div className="mt-12" />

      <DataTable
        data={repos}
        columns={columns}
        renderSubComponent={renderSubComponent}
        getRowCanExpand={() => true}
      />
    </div>
  );
}
