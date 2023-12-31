import { SelectOption } from "@/types/common";
import { Controller } from "react-hook-form";
import Select from "react-select";
import "@/styles/Dropdown.css";
import ErrorMessage from "./ErrorMessage";
import classNames from "classnames";

const Dropdown = ({
  name,
  placeholder,
  options,
  isControl = true,
  showName = false,
  errors,
  ...rest
}: {
  name: string;
  placeholder: string;
  options: SelectOption[];
  isControl?: boolean;
  showName?: boolean;
  errors: any;
  [rest: string]: any;
}) => {
  const classes = classNames(rest.className, "relative", {
    error: errors,
  });

  const getValue = (value: number) => {
    if (value) {
      for (let option of options) {
        if (option.value === value) {
          return option;
        }
      }
    }

    return null;
  };

  return (
    <div className={classes}>
      {isControl && (
        <>
          <Controller
            control={rest.control}
            name={name}
            shouldUnregister
            render={({ field: { onChange, onBlur, name, ref, value } }) => (
              <Select
                options={options}
                onChange={(option: SelectOption | null) =>
                  onChange(option?.value)
                }
                onBlur={onBlur}
                name={name}
                ref={ref}
                value={getValue(value)}
                classNamePrefix="dropdown"
                placeholder={placeholder}
              />
            )}
          />
          {showName && (
            <div className="absolute text-[9px] text-gray-400  top-[-8px] left-2 z-10 bg-white p-[2px]">
              {placeholder}
            </div>
          )}
        </>
      )}
      {!isControl && (
        <Select
          options={options}
          onChange={(option: SelectOption | null) =>
            rest.setterFn(option?.value)
          }
          name={name}
          classNamePrefix="dropdown"
          placeholder={placeholder}
        />
      )}
      <ErrorMessage>{errors?.message}</ErrorMessage>
    </div>
  );
};

export default Dropdown;
