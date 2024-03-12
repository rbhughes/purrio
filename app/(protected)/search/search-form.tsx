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

import { Search } from "lucide-react";
import { FancyMultiSelect } from "./fancy-multi-select";

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

// minor customizations in @components/ui/toggle.tsx
// data-[state=on]:bg-slate-200    data-[state=on]:border-slate-400

export default function SearchForm({ placeholder }: { placeholder: string }) {
  const handleSearch = (term: string) => {
    console.log(term);
  };

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
    //const { data, error } = await enqueueRepoReconTask(formData);
    // if (error) {
    //   toast.error(error);
    // } else {
    //   toast.info(data);
    // }
    console.log("*********************");
    console.log(formData);
    console.log("*********************");

    setSelected([items[0]]);
    form.reset();
  };

  const cardDesc = `
  Limit search by Asset type, Suite, tag and text terms.`;

  return (
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
                        <Search className="absolute mt-3.5 ml-1 text-muted-foreground" />
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
    </Card>
  );
}
