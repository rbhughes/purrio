"use client";

import React from "react";
import { enqueueExportTask } from "@/lib/actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface ExportTask {
  asset: string;
  sql: string;
  total_hits: number;
  user_id: string;
  file_format: string;
}

const FormSchema = z.object({
  type: z.enum(["json", "csv"], {
    required_error: "You need to select an export type.",
  }),
});

export const SearchExport = ({ props }: { props: ExportTask[] }) => {
  const [selectedItems, setSelectedItems] = React.useState<ExportTask[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "json",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    selectedItems.forEach(async (item) => {
      await enqueueExportTask({
        asset: item.asset,
        sql: item.sql,
        total_hits: item.total_hits,
        user_id: item.user_id,
        file_format: data.type,
      });
    });
  }

  return (
    <div className="w-10/12 mx-auto mt-12">
      <Label className="text-muted-foreground">
        Export search results. File location is defined by the worker.
      </Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <div className="flex flex-row mt-4">
                <div className="w-8/12 ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>hits</TableHead>
                        <TableHead>asset</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {props.map((o) => (
                        <TableRow key={o.asset}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.some(
                                (item) => item.asset === o.asset
                              )}
                              disabled={o.total_hits < 1}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems((prevSelectedItems) => [
                                    ...prevSelectedItems,
                                    o,
                                  ]);
                                } else {
                                  setSelectedItems((prevSelectedItems) =>
                                    prevSelectedItems.filter(
                                      (item) => item.asset !== o.asset
                                    )
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{o.total_hits}</TableCell>
                          <TableCell>{o.asset}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="w-2/12"></div>

                <div className="justify-end gap-10 items-center flex flex-row w-2/12">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      <FormItem className="flex items-center space-x-1">
                        <FormControl>
                          <RadioGroupItem value="json" />
                        </FormControl>
                        <FormLabel className="font-normal">JSON</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-1">
                        <FormControl>
                          <RadioGroupItem value="csv" />
                        </FormControl>
                        <FormLabel className="font-normal">CSV</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <Button type="submit">Export</Button>
                </div>

                <FormMessage />
              </div>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
