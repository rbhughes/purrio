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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Search as HourGlass } from "lucide-react";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { GeneralSwitch } from "@/components/general-switch";
import { SuiteUI } from "@/lib/purr_ui";
import { ASSETS, SUITES, simplifyDateString } from "@/lib/purr_utils";
import { enqueueSearchTask } from "@/lib/actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SearchExport, ExportTask } from "./search-export";
import { createClient } from "@/utils/supabase/client";
import { SearchFormSchema } from "./search-form-schema";
import { Database } from "@/lib/sb_types";

type FormInputs = z.infer<typeof SearchFormSchema>;
type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];
type Suite = Database["public"]["Enums"]["suite"];

// minor customizations in @components/ui/toggle.tsx
// data-[state=on]:bg-slate-200    data-[state=on]:border-slate-400

// should match purr_worker
interface SearchBody {
  assets: string[];
  search_id: number;
  suites: Suite[];
  tag: string;
  terms: string;
  user_id: string; //actually UUID
}
interface SearchHistory {
  search_id: number;
  search_body: SearchBody;
  updated_at: string;
}

export default function Search({ userId }: { userId: string }) {
  const supabase = createClient();

  const [searchId, setSearchId] = React.useState<number>(0);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [history, setHistory] = React.useState<SearchHistory[]>([]);
  const [showAdvancedForm, setShowAdvancedForm] = React.useState(true);
  const [exportProps, setExportProps] = React.useState<Object[]>([]);

  ////////////////
  React.useEffect(() => {
    const initHistory = async () => {
      const { data, error } = await supabase
        .from("search_history")
        .select()
        .order("updated_at", { ascending: false })
        .limit(5);
      if (error) {
        console.error(error);
      }
      setHistory(data as SearchHistory[]);
    };
    initHistory();
  }, [userId, searchResults]);
  ////////////////

  const purgeSearchResultsById = async (searchId: number) => {
    const { data, error } = await supabase
      .from("search_result")
      .delete()
      .eq("search_id", searchId);

    if (!data) {
      return;
    }

    if (error) {
      console.error(error);
      return;
    }
  };

  const getSearchResults = async () => {
    const { data, error } = await supabase
      .from("search_result")
      .select()
      .eq("user_id", userId)
      //.eq("search_id", searchId)
      .order("search_id", { ascending: false });

    if (!data) {
      return;
    }

    if (error) {
      console.error(error);
      return;
    }
    /////////////TESTING PORPOISES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //// (just shows whatever is in search_result without filter)
    // let sr = data.filter((x: SearchResult) => x.directive === "search_result");
    // setSearchResults(sr);

    // let prompts = data
    //   .filter((x: SearchResult) => x.directive === "storage_prompt")
    //   .map((x: any) => x.search_body);

    // console.log("prompts.............");
    // console.log(prompts);
    // setExportProps(prompts[0]);
    /////////////TESTING PORPOISES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  };

  React.useEffect(() => {
    getSearchResults();

    const channel = supabase
      .channel("realtime search")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "search_result",
          //filter: `user_id=eq.${userId}`,
          filter: `search_id=eq.${searchId}`,
        },

        async (payload: any) => {
          getSearchResults();
          let newSR: SearchResult = payload.new;

          if (newSR.directive === "search_result") {
            setSearchResults((prev) => [newSR, ...prev]);
          } else if (newSR.directive === "storage_prompt") {
            let sp = (newSR as any).search_body;

            if (sp.length > 0) {
              sp.map((o: any) => (o.user_id = userId));
              setExportProps(sp);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, searchId]);

  let defaults = {
    assets: [{ label: ASSETS[0], value: ASSETS[0] }],
    suites: [SUITES[0]],
    tag: "",
    terms: "",
    user_id: userId,
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: defaults,
  });

  const handleHistorySelect = (sbjson: string) => {
    const sb = JSON.parse(sbjson);

    // hideous?
    setSelectedAssets(
      sb.assets.map((asset: any) => ({
        value: asset,
        label: asset,
      }))
    );

    let sel = sb.assets.map((asset: any) => ({
      value: asset,
      label: asset,
    }));

    form.setValue("assets", sel);
    form.setValue("suites", sb.suites);
    form.setValue("tag", sb.tag);
    form.setValue("terms", sb.terms);
    form.setValue("user_id", sb.user_id);
  };

  type Item = Record<"value" | "label", string>;
  const items: Item[] = ASSETS.map((asset) => ({
    value: asset,
    label: asset,
  }));

  const [selectedAssets, setSelectedAssets] = React.useState<Item[]>([
    items[0],
  ]);

  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    try {
      const { data, error } = await enqueueSearchTask(formData);
      if (error) {
        toast.error(error);
      } else {
        await purgeSearchResultsById(searchId);
        setSearchResults([]);
        setExportProps([]);

        toast.info(JSON.stringify(data));
      }

      setSearchId(data[0].id);

      // 2024-03-23 | stopped resetting form after history
      //setSelectedAssets([items[0]]);
      //form.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const formatHistoryRow = (sh: SearchHistory) => {
    return (
      <div>
        {simplifyDateString(sh.updated_at)}
        {" | "}
        <span className="bg-yellow-300">{sh.search_body.terms}</span>
        {" | "}
        <i>{sh.search_body.assets.join(", ")}</i>
      </div>
    );
  };

  /////////////////////////////////
  const assetSelections: Option[] = ASSETS.map((asset) => ({
    value: asset,
    label: asset,
  }));
  ////////////////////////////////e

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-4 font-mono italic mt-1 text-lg">
        Search local database for indexed assets
      </div>

      <div className="mt-4" />
      <Card className="rounded mx-10">
        <CardHeader>
          <div className="flex flex-row">
            <div className="w-5/6">
              <CardDescription>
                Limit search by Application Suite, Tag, Asset(s) and text search
                terms
              </CardDescription>
            </div>
            {/* HIDE ADVANCED FOR NOW. REMOVE LATER? */}
            <div className="w-1/6 hidden">
              <span className="disabled flex items-center space-x-2 float-right">
                <GeneralSwitch
                  label="Advanced"
                  checked={showAdvancedForm}
                  onChange={setShowAdvancedForm}
                />
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(processForm)}
              className=" space-y-2 "
            >
              {showAdvancedForm && (
                <div className="flex flex-row gap-4">
                  {/* SEARCH FORM */}
                  <div className="w-8/12">
                    {/* --------------------------- */}
                    <div className="flex flex-row gap-2 mb-4">
                      {/* <div className="w-2/6 flex-1"> */}

                      {/* SUITES */}
                      <div className="w-4/6 ">
                        <FormField
                          control={form.control}
                          name="suites"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>suites</FormLabel>
                              <ToggleGroup
                                type="multiple"
                                variant="outline"
                                {...field}
                                onValueChange={(value) =>
                                  form.setValue(field.name, value)
                                }
                              >
                                {SUITES.map((suite: string) => (
                                  <ToggleGroupItem
                                    key={suite}
                                    value={suite}
                                    aria-label={suite}
                                    className="w-4/12"
                                  >
                                    {SuiteUI[suite].icon}
                                  </ToggleGroupItem>
                                ))}
                              </ToggleGroup>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* TAG */}
                      <div className="w-2/6 ">
                        <FormField
                          control={form.control}
                          name="tag"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>tag</FormLabel>
                              <FormControl>
                                <Input placeholder="tag" {...field} />
                              </FormControl>
                              {/* <FormDescription>
                              UNC or drive letter path
                            </FormDescription> */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      {/* ASSETS */}
                      <div className="w-full ">
                        <FormField
                          control={form.control}
                          name="assets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>assets</FormLabel>
                              <FormControl>
                                <MultipleSelector
                                  badgeClassName="bg-orange-500"
                                  value={field.value}
                                  onChange={field.onChange}
                                  defaultOptions={assetSelections}
                                  placeholder="select one or more assets to search..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-row gap-2">{/* TERMS */}</div>
                  </div>

                  {/* SEARCH HISTORY */}
                  <div className="flex flex-col w-4/12 ">
                    <div className="space-y-2">
                      <Label className="h-9">search history</Label>
                      <Select onValueChange={handleHistorySelect}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="previous searches..." />
                        </SelectTrigger>
                        <SelectContent>
                          {history.map((o) => (
                            <SelectItem
                              key={o.search_id}
                              value={JSON.stringify(o.search_body)}
                            >
                              {formatHistoryRow(o)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-row justify-end">
                <div className="w-fit">
                  <HourGlass
                    className="absolute ml-6 text-muted-foreground mt-8 h-14"
                    size={40}
                    strokeWidth={3}
                  />
                </div>

                <div className="w-full mr-2">
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>search</FormLabel>
                        <FormControl>
                          <>
                            <Input
                              placeholder="search"
                              {...field}
                              className="h-14 text-2xl w-full pl-20"
                            />
                          </>
                        </FormControl>
                        {/* <FormDescription>
                              UNC or drive letter path
                            </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* submit */}
                <div className="mt-8 w-[180px]">
                  <Button
                    type="submit"
                    className="purr-form-button h-14 w-full"
                    variant="secondary"
                  >
                    search
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          {exportProps.length > 0 && (
            <SearchExport props={exportProps as ExportTask[]} />
          )}
        </CardContent>
      </Card>

      {Object.keys(form.control._formState.errors).length > 0 && (
        <div className="bg-red-400">
          {JSON.stringify(form.control._formState.errors)}
        </div>
      )}

      <div className="mt-20" />

      {searchResults.length === 0 ? (
        <div className="mx-auto">...</div>
      ) : (
        <DataTable data={searchResults} columns={columns} />
      )}
    </div>
  );
}
