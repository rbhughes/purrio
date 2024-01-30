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

import { enqueueRepoReconTask } from "@/lib/actions";
import { toast } from "sonner";
import { GEOTYPES } from "@/lib/purr_utils";
import { RepoReconFormSchema } from "../repo-recon-form-schema";
import AuxGeographix from "./aux-geographix";
import AuxKingdom from "./aux-kingdom";
import { RepoTable } from "../repo-table";

//import TableVisSwitch from "@/components/table-vis-switch";
import TableVisToggle from "@/components/table-vis-toggle";
import RepoVis from "../repo-vis";
import { createPortal } from "react-dom";

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

  // console.log(tableOrViz);
  //const tableOrViz = document.getElementById("table-or-viz");
  const [tableVizElement, setTableVizElement] = React.useState<HTMLElement>();
  const [showTable, setShowTable] = React.useState<boolean>(true);

  React.useEffect(() => {
    const tve: HTMLElement = document.getElementById("table-or-viz")!;
    if (tve) {
      setTableVizElement(tve);
    }
  });

  ///
  const handleToggle = (checked: boolean) => {
    setShowTable(checked);
  };
  ///

  let defaults = {
    geo_type: GEOTYPES[0],
    recon_root: "",
    worker: workers[0],
    ggx_host: "",
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(RepoReconFormSchema),
    defaultValues: defaults,
  });

  let watchedGeoType = useWatch({
    control: form.control,
    name: "geo_type",
    defaultValue: GEOTYPES[0],
  });

  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    const { data, error } = await enqueueRepoReconTask(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.info(data);
    }

    //TODO: 2024-01-12: custom colors are not working for error/warning, etc
    // a re-init of shadcn didn't resolve
    // https://github.com/emilkowalski/sonner/issues/242
    // https://sonner.emilkowal.ski/
    form.reset();
  };

  const cardDesc = `
  Crawl a directory to locate and automatically create a metadata inventory for
  the specified Repo type.`;

  return (
    <div>
      {tableVizElement &&
        createPortal(
          <TableVisToggle onToggle={handleToggle} />,
          tableVizElement
        )}

      <Card>
        <CardHeader>
          <CardTitle>Repo Recon</CardTitle>
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

                <div className="w-1/6">
                  <FormField
                    control={form.control}
                    name="geo_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repo Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a geo_type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GEOTYPES.map((geotype: string) => {
                              return (
                                <SelectItem key={geotype} value={geotype}>
                                  {geotype}
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

                <div className="w-2/6">
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
                          Directory containing projects
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ---------- */}

                <div className="w-1/6">
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

                <div className="w-1/6 mt-8 ml-10">
                  <Button type="submit" className="purr-button">
                    repo recon
                  </Button>
                </div>
                <div className="w-1/6"></div>
              </div>

              {watchedGeoType === "geographix" && <AuxGeographix form={form} />}
              {watchedGeoType === "kingdom" && <AuxKingdom form={form} />}
            </form>
          </Form>
        </CardContent>
      </Card>

      {showTable ? (
        <RepoTable repos={repos} setValue={form.setValue} />
      ) : (
        <RepoVis repos={repos} />
      )}
    </div>
  );
}
