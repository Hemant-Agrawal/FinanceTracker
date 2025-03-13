"use client"
import { Checkbox } from "@/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
import { Label } from "@/ui/label"
import { Slider } from "@/ui/slider"

export type FilterType = "checkbox" | "radio" | "range"

export interface FilterOption {
  label: string
  value: string | number
}


interface FilterSectionProps {
  title: string
  type: FilterType
  options: FilterOption[]
  value: any
  onChange: (value: any) => void
}

export function FilterSection({ title, type, options, value, onChange }: FilterSectionProps) {
  const renderFilterContent = () => {
    switch (type) {
      case "checkbox":
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${option.value}`}
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...(value || []), option.value]
                      : (value || []).filter((v: string) => v !== option.value)
                    onChange(newValue)
                  }}
                />
                <Label htmlFor={`${title}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        )
      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${title}-${option.value}`} />
                <Label htmlFor={`${title}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "range":
        return (
          <div className="space-y-2">
            <Slider
              min={Number(options[0].value)}
              max={Number(options[1].value)}
              step={(Number(options[1].value) - Number(options[0].value)) / 100}
              value={value || [Number(options[0].value), Number(options[1].value)]}
              onValueChange={onChange}
            />
            <div className="flex justify-between text-sm">
              <span>{value ? value[0] : options[0].value}</span>
              <span>{value ? value[1] : options[1].value}</span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium">{title}</h3>
      {renderFilterContent()}
    </div>
  )
}

