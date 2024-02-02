"use client";

import React from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ASSETS, GEOTYPES } from "@/lib/purr_utils";
import { toast } from "sonner";

import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Search } from "lucide-react";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SearchFormSchema } from "../search-form-schema";
type FormInputs = z.infer<typeof SearchFormSchema>;

export default function SearchForm({ placeholder }: { placeholder: string }) {
  const handleSearch = (term: string) => {
    console.log(term);
  };

  let defaults = {
    asset: ASSETS[0],
    term: "",
    geotypes: GEOTYPES,
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: defaults,
  });

  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    //const { data, error } = await enqueueRepoReconTask(formData);
    // if (error) {
    //   toast.error(error);
    // } else {
    //   toast.info(data);
    // }

    console.log("=====================");
    console.log(formData);
    console.log("=====================");

    form.reset();
  };

  return (
    <Card>
      cardy b
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(processForm)}
            className=" space-y-6 "
          >
            <div className="flex flex-row gap-2">
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
                      <FormDescription>Asset type to collect</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ---------- */}
              <div className="w-1/6">
                <FormField
                  control={form.control}
                  name="geotypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>my form label</FormLabel>
                      <FormControl>
                        <ToggleGroup type="multiple" variant="outline">
                          <ToggleGroupItem
                            //value="bold"
                            aria-label="Toggle bold"
                            {...field}
                          >
                            <FontBoldIcon className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            //value="italic"
                            aria-label="Toggle italic"
                            {...field}
                          >
                            <FontItalicIcon className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            //value="strikethrough"
                            aria-label="Toggle strikethrough"
                            {...field}
                          >
                            <UnderlineIcon className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
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
                      <FormLabel>my form label</FormLabel>
                      <FormControl>
                        <Input placeholder="placeholder??" {...field} />
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
                  repo recon
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
