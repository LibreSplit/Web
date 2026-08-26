import { Card, CardContent } from "@/components/ui/card";
import { CommandBlock } from "@/components/ui/CommandBlock";

export function UninstallInstructions() {
  return (
    <Card class="overflow-hidden py-0">
      <CardContent class="space-y-4 p-6">
        <p class="text-sm leading-6 text-muted-foreground">
          From the LibreSplit source directory, run:
        </p>
        <CommandBlock command={["cd build", "sudo ninja uninstall"]} />
      </CardContent>
    </Card>
  );
}
