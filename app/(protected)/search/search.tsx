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

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { enqueueSearchTask } from "@/lib/actions";

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
type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];

// minor customizations in @components/ui/toggle.tsx
// data-[state=on]:bg-slate-200    data-[state=on]:border-slate-400

export default function Search({
  placeholder,
  searchResults,
}: {
  placeholder: string;
  searchResults: SearchResult[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const [taskId, setTaskId] = React.useState<number>(0);
  const [filteredResult, setFilteredResult] = React.useState<SearchResult[]>(
    []
  );

  React.useEffect(() => {
    const initChannel = () => {
      const chan = liveTable<SearchResult>(supabase, {
        table: "search_result",
        filterColumn: "active",
        filterValue: true,
        // filterColumn: "task_id",
        // filterValue: Number(taskId),
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
  }, [supabase, router, taskId]);

  React.useEffect(() => {
    let filtered = searchResults.filter(
      (sr: SearchResult) => sr.task_id === taskId
    );
    setFilteredResult(filtered);
  }, [taskId, searchResults]);

  // React.useEffect(() => {
  //   let fetcher = async () => {
  //     const { data: searchResults } = await supabase
  //       .from("search_result")
  //       .select()
  //       .order("task_id", { ascending: false });

  //     console.log(searchResults);
  //   };
  //   fetcher();
  // }, [taskId]);

  ///

  let defaults = {
    asset: [ASSETS[0]],
    suites: [SUITES[0]],
    tag: "",
    term: "",
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: defaults,
  });

  type Item = Record<"value" | "label", string>;
  const items: Item[] = ASSETS.map((asset) => ({
    value: asset,
    label: asset,
  }));

  // 2024-03-11 | Not sure how to fully manage FancyMultiSelect with RHF
  // Selection worked as expected, but RHF's reset() did not since "selected"
  // is not exposed. So...I moved the useState hook here to the parent.
  const [selected, setSelected] = React.useState<Item[]>([items[0]]);

  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    const { data, error } = await enqueueSearchTask(formData);
    if (error) {
      toast.error(error);
    } else {
      toast.info(JSON.stringify(data));
    }

    // data: [
    // {
    //   id: 37273,
    //   worker: 'scarab',
    //   directive: 'search',
    //   body: [Object],
    //   status: 'PENDING'
    // }

    setTaskId(data[0].id);

    setSelected([items[0]]);
    form.reset();
  };

  const cardDesc = `
  Limit search by Asset type, Suite, tag and text terms.`;

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardDescription>{cardDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(processForm)}
              className=" space-y-6 "
            >
              <div className="flex flex-row gap-2">
                <div className="w-full">
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
                            field.onChange(values.map(({ value }) => value));
                          }}
                          selected={selected}
                          setSelected={setSelected}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <div className="w-2/6 flex-1">
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
                        {/* <FormDescription>
                              UNC or drive letter path
                            </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ---------- */}
                <div className="w-3/6">
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          my form label
                          <HourGlass className="absolute mt-3.5 ml-1 text-muted-foreground" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="placeholder??"
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
                {/* ---------- */}

                <div className="w-1/6 mt-8 ml-10">
                  <Button type="submit" className="purr-button">
                    search
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        {/* <div>taskId = {taskId}</div> */}
        {/* <div>{JSON.stringify(result)}</div> */}
        {/* <SearchResults searchResults={searchResults} taskId={taskId} /> */}
      </Card>
      <Card>
        <ShowHits searchResults={filteredResult} />
      </Card>
    </div>
  );
}
