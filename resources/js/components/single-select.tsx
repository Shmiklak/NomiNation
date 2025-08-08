import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface Option {
    value: string;
    label: string;
    disable?: boolean;
    /** fixed option that can't be removed. */
    fixed?: boolean;
    /** Group the options by providing key. */
    [key: string]: string | boolean | undefined;
}

interface SingleSelectOption {
    value: string;
    options: Option[];
    placeholder?: string;
    onChange: (options: string) => void;
}
export function SingleSelect({ value, options, placeholder, onChange, ...rest }: SingleSelectOption) {

    function updateValue(newVal: string) {
        onChange(newVal);
    }

    return (
        <Select onValueChange={updateValue} value={value}>
            <SelectTrigger {...rest}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
