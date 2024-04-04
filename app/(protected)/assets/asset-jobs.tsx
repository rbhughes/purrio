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
import { ASSETS, SUITES } from "@/lib/purr_utils";
import { AssetJobFormSchema } from "./asset-job-form-schema";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AssetJobTable } from "./asset-job-table";
import { SuiteUI } from "@/lib/purr_ui";
//import { createPortal } from "react-dom";
//import TableVisSwitch from "@/components/table-vis-switch";
import MissingReposWarning from "./missing-repos-warning";
//import { useVisibilityChange } from "@uidotdev/usehooks";

import AssetDNA from "./asset-dna";

import { ArrowDownLeftSquare, Globe } from "lucide-react";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

type FormInputs = z.infer<typeof AssetJobFormSchema>;

let assetsPlus = ["ALL_ASSETS", ...ASSETS];

export default function AssetJobs({
  repos,
  assetJobs,
  withMissingRepos,
}: {
  repos?: Repo[];
  assetJobs?: AssetJob[];
  withMissingRepos?: AssetJob[];
}) {
  //const [tableVizElement, setTableVizElement] = React.useState<HTMLElement>();
  //const [showTable, setShowTable] = React.useState<boolean>(true);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [showAdvancedForm, setShowAdvancedForm] = React.useState(false);
  //const documentVisible = useVisibilityChange();

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
    suite: [...new Set(repos!.map((repo) => repo.suite as string))][0],
    recency: 14,
    repo_name: null,
    repo_id: "",
    //last_invoked: null,
    //created_at: null,
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(AssetJobFormSchema),
    defaultValues: defaults,
    mode: "onChange",
  });

  // Supabase realtime will get disconnected if it's not the active tab within
  // about 5 minutes. If you return later, it should sync back up, but there
  // may be a non-linear delay, during which time the table and form can get
  // out of sync. Just reset and close the form to avoid confusion for now.
  // https://github.com/orgs/supabase/discussions/10293
  // https://github.com/orgs/supabase/discussions/5641
  // React.useEffect(() => {
  //   if (documentVisible === false) {
  //     form.reset();
  //     setShowForm(false);
  //     setShowAdvancedForm(false);
  //     console.log("you might want to refresh the page");
  //   }
  // }, [documentVisible]);

  let watchedSuite = useWatch({
    control: form.control,
    name: "suite",
    defaultValue: [...new Set(repos!.map((repo) => repo.suite as string))][0],
  });

  let watchedAsset = useWatch({
    control: form.control,
    name: "asset",
    defaultValue: ASSETS[0],
  });

  const refSuite = React.useRef(SUITES[0]);

  React.useEffect(() => {
    form.setValue("repo_id", "");
    refSuite.current = watchedSuite;
  }, [watchedSuite]);

  // we add repo fs_path and name here (joins not supported in subscription)
  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    const repo = repos!.filter((r) => r.id === formData.repo_id)[0];
    formData.repo_fs_path = repo.fs_path;
    formData.suite = repo.suite!;
    formData.repo_name = repo.name;

    // console.log("************");
    // console.log(formData);
    // console.log("************");

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
  Define Asset Collection Jobs for a specific Repo and asset type. For advanced
  usage, add an (optional) SQL "WHERE" clause to limit results. View the SQL if
  you would like to see specific fields/columns.`;

  return (
    <div>
      <Collapsible open={showForm} onOpenChange={setShowForm}>
        <div className="flex mb-4 justify-between">
          <div className="place-self-center purr-h1">asset collection</div>
          <CollapsibleTrigger asChild>
            <Button variant="secondary">
              <ArrowDownLeftSquare className="mx-2 bg-yellow-400 text-orange-500" />
              Define Asset Collection Jobs...
            </Button>
          </CollapsibleTrigger>
        </div>

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
                    //style={{ backgroundColor: "#facc15" }}
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

                    <div className="w-2/12">
                      <FormField
                        control={form.control}
                        name="suite" //this should match repo.suite, no?
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Suite</FormLabel>
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
                                {[
                                  ...new Set(
                                    repos!.map((repo) => repo.suite as string)
                                  ),
                                ].map((gt: string) => {
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

                    <div className="w-3/12">
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
                                    (repo: Repo) => repo.suite === watchedSuite
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

                    <div className="w-2/12">
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
                                {assetsPlus.map((asset: string) => {
                                  return (
                                    <SelectItem key={asset} value={asset}>
                                      {asset}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormDescription>"data type"</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ---------- */}
                    <div className="w-1/6">
                      <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tag</FormLabel>
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

                    <div className="w-1/12 mt-8 ml-10">
                      <Button
                        type="submit"
                        className="purr-form-button"
                        variant="secondary"
                      >
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
                        <div className="w-1/12">
                          <FormField
                            control={form.control}
                            name="chunk"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Chunk</FormLabel>
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

                        {/* <div className="flex basis-1/6">
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
                        </div> */}

                        {/* ---------- */}

                        {/* <div className="w-1/12 bg-blue-100">nothing</div> */}

                        <div className="w-4/12">
                          <FormField
                            control={form.control}
                            name="recency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recency</FormLabel>
                                <FormControl>
                                  <Input
                                    className="w-3/12"
                                    placeholder="days ago"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  collect data modified n days ago
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

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
                        <div className="w-11/12">
                          <AssetDNA suite={watchedSuite} asset={watchedAsset} />
                        </div>
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
