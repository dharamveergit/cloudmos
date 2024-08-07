"use client";
import { ReactNode } from "react";
import { Control } from "react-hook-form";
import { FormField, FormInput, FormItem, FormLabel, Popup, Textarea } from "@akashnetwork/ui/components";

import { SdlBuilderFormValuesType } from "@src/types";
import { FormPaper } from "./FormPaper";

type Props = {
  serviceIndex: number;
  onClose: () => void;
  control: Control<SdlBuilderFormValuesType, any>;
  children?: ReactNode;
};

export const CommandFormModal: React.FunctionComponent<Props> = ({ control, serviceIndex, onClose }) => {
  return (
    <Popup
      fullWidth
      open
      variant="custom"
      title="Edit Commands"
      actions={[
        {
          label: "Close",
          color: "primary",
          variant: "ghost",
          side: "right",
          onClick: onClose
        }
      ]}
      onClose={onClose}
      maxWidth="sm"
      enableCloseOnBackdropClick
    >
      <FormPaper className="!bg-popover">
        <FormField
          control={control}
          name={`services.${serviceIndex}.command.command`}
          render={({ field }) => (
            <FormInput type="text" label="Command" value={field.value} placeholder="Example: bash -c" onChange={event => field.onChange(event.target.value)} />
          )}
        />

        <FormField
          control={control}
          name={`services.${serviceIndex}.command.arg`}
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Arguments</FormLabel>
              <Textarea
                aria-label="Args"
                placeholder="Example: apt-get update; apt-get install -y --no-install-recommends -- ssh;"
                className="mt-2 w-full px-4 py-2 text-sm"
                value={field.value}
                rows={4}
                spellCheck={false}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />
      </FormPaper>
    </Popup>
  );
};
