import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputButtonGroup() {
  return (
    <Field className="w-full">
      <ButtonGroup className="w-full flex">
        <Input
          id="input-button-group"
          placeholder="Type to search..."
          className="w-full min-w-0 bg-neutral-200"
        />
        <Button variant="outline" className="shrink-0">
          Search
        </Button>
      </ButtonGroup>
    </Field>
  )
}
