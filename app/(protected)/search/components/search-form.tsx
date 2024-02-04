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
import { GeoTypeUI } from "@/lib/purr_ui";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";

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
    geo_types: [],
    tag: "",
    term: "",
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
              {/* ---------- */}
              {/* ---------- */}
              <div className="w-2/6 flex-1">
                <FormField
                  control={form.control}
                  name="geo_types"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>geotypes</FormLabel>
                      <ToggleGroup
                        type="multiple"
                        //size="lg"
                        //orientation="horizontal"
                        variant="outline"
                        {...field}
                        onValueChange={(value) =>
                          form.setValue(field.name, value)
                        }
                      >
                        {GEOTYPES.map((gt: string) => (
                          <ToggleGroupItem key={gt} value={gt} aria-label={gt}>
                            {GeoTypeUI.find((x) => x.value === gt)!.icon()}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
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
