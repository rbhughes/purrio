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

import { createAssetJob, updateAssetJob } from "@/lib/actions";
import { toast } from "sonner";
import { ASSETS, GEOTYPES } from "@/lib/purr_utils";
import { AssetJobFormSchema } from "../asset-job-form-schema";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

///
import { AssetJobTable } from "../asset-job-table";
///

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

type FormInputs = z.infer<typeof AssetJobFormSchema>;

//const renderSubComponent = ({ row }: { row: any<AssetJob> }) => {
//const renderSubComponent = ({ row }: { row: Row<AssetJob> }) => {
export const renderSubComponent = ({
  row,
}: //repos,
{
  row: any;
  //repos: Repo[];
}) => {
  //return <AssetJobForm repos={[row]} />;

  return (
    <pre style={{ fontSize: "10px" }}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  );
};

// export const renderAssetJobForm = ({
//   repos,
//   asset_job,
// }: {
//   repos: Repo[];
//   asset_job?: AssetJob;
// }) => {
//   return (
//     <pre style={{ fontSize: "10px" }}>
//       {/* <code>{JSON.stringify(row.original, null, 2)}</code> */}
//       <code>{JSON.stringify(repos, null, 2)}</code>
//       <code>{JSON.stringify(asset_job, null, 2)}</code>
//     </pre>
//   );
// };

///////////////////////////////////////////////////////////

export default function AssetJobForm({
  repos,
  assetJobs,
}: {
  repos?: Repo[];
  assetJobs?: AssetJob[];
}) {
  const [showAdvancedForm, setShowAdvancedForm] = React.useState(false);

  const handleToggleAdvancedForm = () => {
    setShowAdvancedForm(!showAdvancedForm);
  };

  let defaults: FormInputs = {
    id: undefined,
    active: true,
    asset: ASSETS[0],
    chunk: 100,
    cron: "",
    filter: "",
    //last_invoked: null,
    repo_fs_path: null,
    geo_type: [...new Set(repos!.map((repo) => repo.geo_type as string))][0],
    repo_name: null,
    repo_id: "",
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
  // const [selectedGeoType, setSelectedGeoType] = React.useState(
  //   refGeoType.current
  // );

  React.useEffect(() => {
    form.setValue("repo_id", "");
    refGeoType.current = watchedGeoType;
  }, [watchedGeoType]);

  // we add repo fs_path and name here (joins not supported in subscription)
  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    console.log("################################");
    console.log(formData);
    console.log("################################");

    const repo = repos!.filter((r) => r.id === formData.repo_id)[0];
    formData.repo_fs_path = repo.fs_path;
    formData.geo_type = repo.geo_type!;
    formData.repo_name = repo.name;

    //const result = await updateAssetJob(formData)
    // if (formData.id === 1e10) {

    // } else {

    // }

    const result =
      formData.id === 2e63
        ? await createAssetJob(formData)
        : await updateAssetJob(formData);

    if (!result) {
      toast.error("No results returned when trying to save AssetJob");
      return;
    }

    // if (result.error) {
    //   toast.error(JSON.stringify(result.error, null, 2));
    //   return;
    // }

    //toast.info(JSON.stringify(result.status, null, 2));
    form.reset();
  };

  const cardDesc = `
  Define an Asset collection job for a specific Repo. The optional filter
  creates a SQL "WHERE" clause to limit results.`;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Asset Jobs
            <span className="flex items-center space-x-2 float-right">
              <Label htmlFor="advToggle">Advanced </Label>
              <Switch id="advToggle" onClick={handleToggleAdvancedForm} />
            </span>
          </CardTitle>
          <CardDescription>{cardDesc}</CardDescription>
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
                                repos!.map((repo) => repo.geo_type as string)
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
                            {repos!
                              .filter(
                                (repo: Repo) => repo.geo_type === watchedGeoType
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
                        <FormDescription>Data to collect</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ---------- */}

                <div className="w-1/12 mt-8">
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
                              <Input placeholder="cron" {...field} />
                            </FormControl>
                            <FormDescription>This is cron</FormDescription>
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
      <AssetJobTable assetJobs={assetJobs!} setValue={form.setValue} />
    </div>
  );
}
