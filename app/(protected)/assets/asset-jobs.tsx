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

import { createAssetJob, updateAssetJob } from "@/lib/actions";
import { toast } from "sonner";
import { ASSETS, GEOTYPES } from "@/lib/purr_utils";
import { AssetJobFormSchema } from "./asset-job-form-schema";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AssetJobTable } from "./asset-job-table";
import { createPortal } from "react-dom";
import TableVisSwitch from "@/components/table-vis-switch";
import MissingReposWarning from "./missing-repos-warning";

import { ArrowDownRightSquare } from "lucide-react";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

type FormInputs = z.infer<typeof AssetJobFormSchema>;

///////////////////////////////////////////////////////////

export default function AssetJobs({
  repos,
  assetJobs,
  withMissingRepos,
}: {
  repos?: Repo[];
  assetJobs?: AssetJob[];
  withMissingRepos?: AssetJob[];
}) {
  const [tableVizElement, setTableVizElement] = React.useState<HTMLElement>();
  const [showTable, setShowTable] = React.useState<boolean>(true);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [showAdvancedForm, setShowAdvancedForm] = React.useState(false);

  // because "document" may not exist in nextjs client for some reason...
  React.useEffect(() => {
    const tve: HTMLElement = document.getElementById("table-or-viz")!;
    if (tve) {
      setTableVizElement(tve);
    }
  });

  const handleToggle = (checked: boolean) => {
    setShowTable(checked);
  };

  const handleToggleAdvancedForm = () => {
    setShowAdvancedForm(!showAdvancedForm);
  };

  let defaults: FormInputs = {
    id: undefined,
    active: true,
    asset: ASSETS[0],
    tag: "",
    chunk: 100,
    cron: "",
    filter: "",
    repo_fs_path: null,
    geo_type: [...new Set(repos!.map((repo) => repo.geo_type as string))][0],
    repo_name: null,
    repo_id: "",
    //last_invoked: null,
    //row_created: null,
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(AssetJobFormSchema),
    defaultValues: defaults,
  });

  let watchedGeoType = useWatch({
    control: form.control,
    name: "geo_type",
    defaultValue: [
      ...new Set(repos!.map((repo) => repo.geo_type as string)),
    ][0],
  });

  let watchedAsset = useWatch({
    control: form.control,
    name: "asset",
    defaultValue: ASSETS[0],
  });

  const refGeoType = React.useRef(GEOTYPES[0]);

  React.useEffect(() => {
    form.setValue("repo_id", "");
    refGeoType.current = watchedGeoType;
  }, [watchedGeoType]);

  // we add repo fs_path and name here (joins not supported in subscription)
  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    const repo = repos!.filter((r) => r.id === formData.repo_id)[0];
    formData.repo_fs_path = repo.fs_path;
    formData.geo_type = repo.geo_type!;
    formData.repo_name = repo.name;

    const { data, error } =
      formData.id === 2e63
        ? await createAssetJob(formData)
        : await updateAssetJob(formData);

    if (error) {
      toast.error(data);
    } else {
      toast.info(data);
    }

    form.reset();
  };

  const cardDesc = `
  Define Asset Collection Jobs for a specific Repo and asset type. Add an
  optional SQL "WHERE" clause filter to limit results.`;

  return (
    <div>
      {tableVizElement &&
        createPortal(
          <TableVisSwitch onToggle={handleToggle} />,
          tableVizElement
        )}

      <Collapsible open={showForm} onOpenChange={setShowForm}>
        <CollapsibleTrigger asChild>
          <Button className="" variant="outline">
            <ArrowDownRightSquare className="mx-2" />
            Define Asset Collection Jobs...
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardDescription>
                {cardDesc}

                <span className="flex items-center space-x-2 float-right">
                  <Label htmlFor="advToggle">Advanced </Label>
                  <Switch
                    id="advToggle"
                    onClick={handleToggleAdvancedForm}
                    checked={showAdvancedForm}
                  />
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(processForm)}
                  className=" space-y-6 "
                >
                  {/* -------------------- */}

                  <FormField
                    control={form.control}
                    name="id"
                    defaultValue={2e63} //
                    render={({ field }) => (
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    )}
                  />

                  {/* -------------------- */}
                  <div className="flex flex-row gap-2">
                    <div className="w-1/12">
                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="w-1/12">
                            <FormLabel>Active</FormLabel>
                            <FormControl>
                              <Checkbox
                                className="h-9 w-9"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ---------- */}

                    <div className="w-1/6">
                      <FormField
                        control={form.control}
                        name="geo_type" //this should match repo.geo_type, no?
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
                                {[
                                  ...new Set(
                                    repos!.map(
                                      (repo) => repo.geo_type as string
                                    )
                                  ),
                                ].map((gt: string) => {
                                  return (
                                    <SelectItem key={gt} value={gt}>
                                      {gt}
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
                                {repos!
                                  .filter(
                                    (repo: Repo) =>
                                      repo.geo_type === watchedGeoType
                                  )
                                  .map((repo: Repo) => (
                                    <SelectItem key={repo.id} value={repo.id}>
                                      {repo.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Source project</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ---------- */}

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
                            <FormDescription>
                              Asset type to collect
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ---------- */}

                    <div className="w-1/12 mt-8 ml-10">
                      <Button type="submit" className="purr-button">
                        save job
                      </Button>
                    </div>
                  </div>

                  {showAdvancedForm && (
                    <>
                      {/* -------------------- */}
                      <div className="flex flex-row gap-2">
                        <div className="w-1/12"></div>

                        {/* ---------- */}
                        <div className="w-1/6">
                          <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>tag</FormLabel>
                                <FormControl>
                                  <Input placeholder="tag" {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* ---------- */}
                        <div className="w-1/6">
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
                        </div>

                        {/* ---------- */}

                        <div className="flex basis-1/6">
                          <FormField
                            control={form.control}
                            name="cron"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>cron</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="cron"
                                    disabled
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  cron expression
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* ---------- */}

                        <div className="w-2/6">
                          <FormField
                            control={form.control}
                            name="filter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>filter</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="filter" {...field} />
                                </FormControl>
                                <FormDescription>
                                  SQL "WHERE" clause stub
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* -------------------- */}

                      <div className="flex flex-row gap-2">
                        <div className="w-1/12"></div>
                        <div className="w-11/12">{watchedAsset}</div>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="my-6" />

      <AssetJobTable
        assetJobs={assetJobs!}
        setValue={form.setValue}
        setShowForm={setShowForm}
        setShowAdvancedForm={setShowAdvancedForm}
      />

      {withMissingRepos!.length > 0 && (
        <>
          <div className="my-6" />
          <MissingReposWarning withMissingRepos={withMissingRepos!} />
        </>
      )}
    </div>
  );
}
