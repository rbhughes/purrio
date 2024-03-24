"use client";

import React from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ASSETS, SUITES } from "@/lib/purr_utils";
import { toast } from "sonner";

import { SuiteUI } from "@/lib/purr_ui";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  enqueueSearchTask,
  //updateProfileWithSearchIds,
  //updateProfileSearchHistory,
} from "@/lib/actions";

import { Search as HourGlass } from "lucide-react";
import { FancyMultiSelect } from "./fancy-multi-select";
import { ShowHits } from "./show-hits";

import {
  Form,
  FormControl,
  //FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  //CardTitle,
} from "@/components/ui/card";

import { SearchFormSchema } from "./search-form-schema";
type FormInputs = z.infer<typeof SearchFormSchema>;
//import { SearchResults } from "./search-results";
import { useRouter } from "next/navigation";

import { liveTable } from "@openartmarket/supabase-live-table";

import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/sb_types";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];

type Suite = Database["public"]["Enums"]["suite"];

// minor customizations in @components/ui/toggle.tsx
// data-[state=on]:bg-slate-200    data-[state=on]:border-slate-400

// matches purr_worker
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

export default function Search({
  userId,
  searchResults,
}: {
  userId: string;
  searchResults: SearchResult[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const [searchId, setSearchId] = React.useState<number>();
  const [filteredResult, setFilteredResult] = React.useState<SearchResult[]>(
    []
  );

  const [history, setHistory] = React.useState<SearchHistory[]>([]);

  ////////////////
  React.useEffect(() => {
    const initHistory = async () => {
      const { data, error } = await supabase.from("search_history").select();
      setHistory(data as SearchHistory[]);
    };
    initHistory();
  }, [userId, filteredResult]);
  ////////////////

  //console.log("^^^^^");
  //console.log(Object.keys(searchHistory));
  //console.log("^^^^^");

  // live channel subscription to search_result
  React.useEffect(() => {
    const initChannel = () => {
      const chan = liveTable<SearchResult>(supabase, {
        table: "search_result",
        filterColumn: "active",
        filterValue: true,
        callback: (err) => {
          if (err) {
            console.error(err);
            chan.unsubscribe().then(() => initChannel());
            location.reload();
            return;
          }
          router.refresh();
        },
      });
      return chan;
    };
    const channel = initChannel();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, searchId]);

  // match a search request id (following enqueue) to live search_result rows
  React.useEffect(() => {
    let filtered = searchResults.filter(
      (sr: SearchResult) => sr.search_id === searchId
    );
    setFilteredResult(filtered);
    console.log("searchId, searchResults useEffect !!!!!!!!!!");

    //updateProfileWithSearchIds(userId);
    //updateProfileSearchHistory(userId);
  }, [searchId, searchResults]);

  let defaults = {
    asset: [ASSETS[0]],
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

  // 2024-03-11 | Not sure how to fully manage FancyMultiSelect with RHF
  // Selection worked as expected, but RHF's reset() did not since "selected"
  // is not exposed. So...I moved the useState hook here to the parent.
  const [selectedAssets, setSelectedAssets] = React.useState<Item[]>([
    items[0],
  ]);

  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    try {
      const { data, error } = await enqueueSearchTask(formData);
      if (error) {
        toast.error(error);
      } else {
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

  const cardDesc = `
  Limit search by Asset type, Suite, tag and text terms.`;

  return (
    <div className="flex flex-col  bg-yellow-600 ">
      <Card>
        <CardHeader>
          <CardDescription>{cardDesc}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row gap-4">
            {/* SEARCH FORM */}
            <div className="w-8/12 p-2 bg-red-100">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(processForm)}
                  className=" space-y-2 "
                >
                  {/* --------------------------- */}
                  <div className="flex flex-row gap-2">
                    {/* <div className="w-2/6 flex-1"> */}

                    {/* SUITES */}
                    <div className="">
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
                                  className="purr-suite-toggle"
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
                    <div className="">
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

                  <div className="flex flex-row gap-2">
                    {/* ASSETS */}
                    <div className="">
                      <FormField
                        control={form.control}
                        name="assets"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset</FormLabel>

                            <FancyMultiSelect
                              items={ASSETS.map((asset) => ({
                                value: asset,
                                label: asset,
                              }))}
                              onChange={(values) => {
                                field.onChange(
                                  values.map(({ value }) => value)
                                );
                              }}
                              selected={selectedAssets}
                              setSelected={setSelectedAssets}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row gap-2">
                    {/* terms */}
                    <div className="">
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              my form label
                              <HourGlass className="absolute mt-3.5 ml-1 text-muted-foreground" />
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="search terms"
                                {...field}
                                className="ml-10"
                              />
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
                    <div className="w-1/6 mt-8 ml-10">
                      <Button type="submit" className="purr-button">
                        search
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* SEARCH HISTORY */}
            <div className="flex flex-col w-4/12  bg-red-100 p-2">
              <div className="space-y-2">
                <Label className="h-9">Search History</Label>
                <Select onValueChange={handleHistorySelect}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Search History" />
                  </SelectTrigger>
                  <SelectContent>
                    {history.map((o) => (
                      <SelectItem
                        key={o.search_id}
                        value={JSON.stringify(o.search_body)}
                      >
                        {`${o.updated_at} | ${o.search_body.assets.join(
                          ", "
                        )} | <span className="bg-yellow-400">${
                          o.search_body.terms
                        }</span>`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        {/* <div>taskId = {taskId}</div> */}
        {/* <div>{JSON.stringify(result)}</div> */}
        {/* <SearchResults searchResults={searchResults} taskId={taskId} /> */}
      </Card>

      {JSON.stringify(form.control._formState.errors)}

      <Card className="bg-blue-100 max-w-max">
        <ShowHits searchResults={filteredResult} />
        {/* <ShowHits searchResults={searchResults} /> */}
      </Card>
    </div>
  );
}
